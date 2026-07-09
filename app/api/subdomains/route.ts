import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CloudflareClient } from "@/lib/cloudflare";
import { z } from "zod";
import { NextResponse } from "next/server";
import { checkSubdomainLimit, logActivity } from "@/lib/supabase/queries";

const createSubdomainSchema = z.object({
  name: z
    .string()
    .min(3, "Subdomain minimal 3 karakter")
    .max(63, "Subdomain maksimal 63 karakter")
    .regex(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/, "Format subdomain tidak valid"),
  target: z.string().optional(),
});

export async function GET() {
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
              // Ignore cookie errors
            }
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("subdomains")
      .select("*")
      .eq("user_id", user.id)
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
              // Ignore cookie errors
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
    const result = createSubdomainSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: result.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { name, target } = result.data;

    const canCreate = await checkSubdomainLimit(supabase, user.id);
    if (!canCreate) {
      return NextResponse.json(
        { error: { code: "LIMIT_REACHED", message: "Maksimal 3 subdomain per akun" } },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("subdomains")
      .insert({
        user_id: user.id,
        name,
        target,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: { code: "CONFLICT", message: "Subdomain sudah digunakan" } },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    await logActivity(supabase, user.id, "subdomain_created", { subdomain_id: data.id, name });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: error.message || "Internal server error" } },
      { status: 500 }
    );
  }
}
