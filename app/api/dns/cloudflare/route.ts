import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createDnsRecordSchema, updateDnsRecordSchema } from "@/lib/validations";
import { apiError, handleApiError } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";
import { CloudflareClient } from "./cloudflare-client";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum(["create_record", "update_record", "delete_record", "list_records"]),
  subdomainId: z.string().uuid(),
  recordId: z.string().optional(),
  type: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "NS"]).optional(),
  name: z.string().optional(),
  value: z.string().optional(),
  ttl: z.number().optional(),
  priority: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = rateLimit(`dns_${user.id}_${ip}`, { limit: 20, windowMs: 60000 });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMIT_EXCEEDED", message: "Terlalu banyak permintaan" } },
        { status: 429, headers: { "Retry-After": String(rateLimitResult.retryAfter) } }
      );
    }

    const body = await req.json();
    const parsedBody = actionSchema.parse(body);
    const { action, subdomainId, recordId } = parsedBody;

    const { data: subdomain, error: subError } = await supabase
      .from("subdomains")
      .select("*")
      .eq("id", subdomainId)
      .eq("user_id", user.id)
      .single();

    if (subError || !subdomain) {
      return apiError("Subdomain tidak ditemukan atau Anda tidak memiliki akses", "FORBIDDEN", 403);
    }

    const fullDomainName = `${subdomain.name}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "lapak.click"}`;

    switch (action) {
      case "list_records": {
        try {
          const cloudflareClient = new CloudflareClient();
          const records = await cloudflareClient.listDnsRecords();
          const filteredRecords = records ? records.filter((r: any) => r.name.endsWith(fullDomainName)) : [];
          return NextResponse.json({ data: filteredRecords });
        } catch (error: any) {
          console.error("Cloudflare list error:", error);
          // If Cloudflare fails (e.g. invalid token), return empty array so UI doesn't crash
          return NextResponse.json({ data: [] });
        }
      }

      case "create_record": {
        const createData = createDnsRecordSchema.parse(body);
        
        const isRootTarget = createData.name === "@" || createData.name === "";
        const recordName = isRootTarget ? fullDomainName : `${createData.name}.${fullDomainName}`;

        const cloudflareClient = new CloudflareClient();
        const newRecord = await cloudflareClient.createDnsRecord({
          type: createData.type,
          name: recordName,
          content: createData.value,
          ttl: createData.ttl,
          priority: createData.priority,
        });
        
        await supabase.from("dns_records").insert({
          subdomain_id: subdomain.id,
          cf_record_id: newRecord.id,
          type: createData.type,
          name: createData.name,
          value: createData.value,
          ttl: createData.ttl,
          priority: createData.priority,
        });

        return NextResponse.json({ data: newRecord });
      }

      case "update_record": {
        if (!recordId) return apiError("recordId wajib diisi", "VALIDATION_ERROR", 400);
        
        const updateData = updateDnsRecordSchema.parse(body);
        
        const { data: existingRecord } = await supabase
          .from("dns_records")
          .select("*")
          .eq("id", recordId)
          .eq("subdomain_id", subdomain.id)
          .single();
          
        if (!existingRecord) {
           return apiError("DNS record tidak ditemukan di database", "NOT_FOUND", 404);
        }

        const cloudflareClient = new CloudflareClient();
        const updatedRecord = await cloudflareClient.updateDnsRecord(existingRecord.cf_record_id, {
          type: (updateData.type || existingRecord.type),
          name: updateData.name ? (updateData.name === "@" || updateData.name === "" ? fullDomainName : `${updateData.name}.${fullDomainName}`) : existingRecord.name,
          content: updateData.value || existingRecord.value,
          ttl: updateData.ttl || existingRecord.ttl,
          priority: updateData.priority || existingRecord.priority,
        });
        
        await supabase.from("dns_records").update({
          type: updateData.type || existingRecord.type,
          name: updateData.name || existingRecord.name,
          value: updateData.value || existingRecord.value,
          ttl: updateData.ttl || existingRecord.ttl,
          priority: updateData.priority || existingRecord.priority,
        }).eq("id", recordId);

        return NextResponse.json({ data: updatedRecord });
      }

      case "delete_record": {
        if (!recordId) return apiError("recordId wajib diisi", "VALIDATION_ERROR", 400);
        
        const { data: recordToDelete } = await supabase
          .from("dns_records")
          .select("*")
          .eq("id", recordId)
          .eq("subdomain_id", subdomain.id)
          .single();
          
        if (!recordToDelete) {
           return apiError("DNS record tidak ditemukan di database", "NOT_FOUND", 404);
        }
        
        const cloudflareClient = new CloudflareClient();
        await cloudflareClient.deleteDnsRecord(recordToDelete.cf_record_id);
        await supabase.from("dns_records").delete().eq("id", recordId);
        
        return NextResponse.json({ success: true });
      }
        
      default:
        return apiError("Action tidak valid", "VALIDATION_ERROR", 400);
    }
  } catch (error) {
    return handleApiError(error);
  }
}
