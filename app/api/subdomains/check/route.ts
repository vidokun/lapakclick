import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";
import { NextResponse } from "next/server";

const checkSubdomainSchema = z.object({
  name: z
    .string()
    .min(3, "Subdomain minimal 3 karakter")
    .max(63, "Subdomain maksimal 63 karakter")
    .regex(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/, "Format subdomain tidak valid"),
});

export async function POST(request: Request) {
  try {
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

    const body = await request.json();
    const result = checkSubdomainSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json(
          { error: { code: "VALIDATION_ERROR", message: "Invalid payload" } },
          { status: 400 }
        );
      }

    const { name } = result.data;

    const { count, error } = await supabase
      .from("subdomains")
      .select("*", { count: "exact", head: true })
      .eq("name", name);

    if (error) {
      return NextResponse.json({ error: { code: "DB_ERROR", message: error.message } }, { status: 500 });
    }

    const available = count === 0;

    return NextResponse.json({ available });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
