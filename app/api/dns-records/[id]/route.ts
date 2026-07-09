import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/supabase/queries";
import { CloudflareClient } from "@/lib/cloudflare";

const updateDnsRecordSchema = z.object({
  type: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "NS"]).optional(),
  name: z.string().min(1).optional(),
  value: z.string().min(1).optional(),
  ttl: z.number().int().min(60).max(86400).optional(),
  priority: z.number().int().min(0).max(65535).optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              
            }
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } }, { status: 401 });
    }

    const body = await request.json();
    const result = updateDnsRecordSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json(
          { error: { code: "VALIDATION_ERROR", message: "Invalid payload" } },
          { status: 400 }
        );
      }
    
    const { data: currentRecord, error: getError } = await supabase
      .from("dns_records")
      .select(`
        *,
        subdomains!inner(id, name, user_id)
      `)
      .eq("id", params.id)
      .single();

    if (getError || !currentRecord || currentRecord.subdomains.user_id !== user.id) {
       return NextResponse.json({ error: { code: "NOT_FOUND", message: "DNS Record tidak ditemukan atau akses ditolak" } }, { status: 404 });
    }
    
    if (currentRecord.cloudflare_id && (result.data.type || result.data.value || result.data.ttl || result.data.name)) {
        const cfClient = new CloudflareClient();
        
        const type = result.data.type || currentRecord.type;
        const namePart = result.data.name || currentRecord.name;
        const value = result.data.value || currentRecord.value;
        const ttl = result.data.ttl || currentRecord.ttl;
        
        const fullRecordName = namePart === '@' ? currentRecord.subdomains.name : `${namePart}.${currentRecord.subdomains.name}`;
        
        try {
            await cfClient.updateDnsRecord(currentRecord.cloudflare_id, {
                type,
                name: fullRecordName,
                content: value,
                ttl
            });
        } catch (err) {
             console.error("Cloudflare error", err);
             return NextResponse.json(
              { error: { code: "CLOUDFLARE_ERROR", message: "Gagal update record di Cloudflare" } },
              { status: 502 }
            );
        }
    }

    const { data, error } = await supabase
      .from("dns_records")
      .update({ ...result.data, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: { code: "DB_ERROR", message: error.message } }, { status: 500 });
    }

    await logActivity(supabase, user.id, "dns_updated", { record_id: data.id, record_type: data.type });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              
            }
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } }, { status: 401 });
    }

    const { data: currentRecord, error: getError } = await supabase
      .from("dns_records")
      .select(`
        *,
        subdomains!inner(id, name, user_id)
      `)
      .eq("id", params.id)
      .single();

    if (getError || !currentRecord || currentRecord.subdomains.user_id !== user.id) {
       return NextResponse.json({ error: { code: "NOT_FOUND", message: "DNS Record tidak ditemukan atau akses ditolak" } }, { status: 404 });
    }
    
    if (currentRecord.cloudflare_id) {
        const cfClient = new CloudflareClient();
        try {
            await cfClient.deleteDnsRecord(currentRecord.cloudflare_id);
        } catch (err) {
             console.error("Cloudflare error", err);
        }
    }

    const { error } = await supabase
      .from("dns_records")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: { code: "DB_ERROR", message: error.message } }, { status: 500 });
    }

    await logActivity(supabase, user.id, "dns_deleted", { record_type: currentRecord.type, record_name: currentRecord.name });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
