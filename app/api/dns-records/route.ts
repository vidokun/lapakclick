import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/supabase/queries";
import { CloudflareClient } from "@/lib/cloudflare";

const createDnsRecordSchema = z.object({
  subdomain_id: z.string().uuid(),
  type: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "NS"]),
  name: z.string().min(1),
  value: z.string().min(1),
  ttl: z.number().int().min(60).max(86400).default(120),
  priority: z.number().int().min(0).max(65535).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomainId = searchParams.get("subdomain_id");

    if (!subdomainId) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "subdomain_id is required" } }, { status: 400 });
    }

    const cookieStore = cookies();
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

    const { data: subdomain, error: subdomainError } = await supabase
      .from("subdomains")
      .select("id")
      .eq("id", subdomainId)
      .eq("user_id", user.id)
      .single();
      
    if (subdomainError) {
       return NextResponse.json({ error: { code: "FORBIDDEN", message: "Akses ditolak" } }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("dns_records")
      .select("*")
      .eq("subdomain_id", subdomainId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: { code: "DB_ERROR", message: error.message } }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: error.message || "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
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
    const result = createDnsRecordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: result.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { subdomain_id, type, name, value, ttl, priority } = result.data;

    const { data: subdomain, error: subdomainError } = await supabase
      .from("subdomains")
      .select("id, name")
      .eq("id", subdomain_id)
      .eq("user_id", user.id)
      .single();
      
    if (subdomainError) {
       return NextResponse.json({ error: { code: "FORBIDDEN", message: "Akses ditolak" } }, { status: 403 });
    }
    
    const cfClient = new CloudflareClient(
      process.env.CLOUDFLARE_API_TOKEN!,
      process.env.CLOUDFLARE_ZONE_ID!
    );
    
    let cloudflare_id = null;
    
    try {
       const fullRecordName = name === '@' ? subdomain.name : `${name}.${subdomain.name}`;
       const cfResult = await cfClient.createDnsRecord(fullRecordName, type, value, ttl);
       if(cfResult.success && cfResult.result) {
         cloudflare_id = cfResult.result.id;
       }
    } catch(err) {
       console.error("Cloudflare error", err);
       return NextResponse.json(
        { error: { code: "CLOUDFLARE_ERROR", message: "Gagal membuat record di Cloudflare" } },
        { status: 502 }
      );
    }

    const { data, error } = await supabase
      .from("dns_records")
      .insert({
        subdomain_id,
        type,
        name,
        value,
        ttl,
        priority,
        cloudflare_id
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    await logActivity(supabase, user.id, "dns_added", { subdomain_id, record_type: type, record_name: name });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: error.message || "Internal server error" } },
      { status: 500 }
    );
  }
}
