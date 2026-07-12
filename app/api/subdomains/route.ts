import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { checkSubdomainLimit } from "@/lib/supabase/queries";
import { CloudflareClient } from "@/lib/cloudflare";
import { createSubdomainSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch subdomains
    const { data: subdomains, error } = await supabase
      .from("subdomains")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch subdomains" },
        { status: 500 }
      );
    }

    // WAJIB KEMBALIKAN DALAM FORMAT { data: [...] } AGAR COCOK DENGAN FRONTEND
    return NextResponse.json({ data: subdomains });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success, retryAfter } = rateLimit(ip, { limit: 10, windowMs: 60000 }); // 10 requests per minute
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { 
          status: 429,
          headers: {
            "Retry-After": retryAfter?.toString() || "60"
          }
        }
      );
    }

    // Parse and validate request
    const body = await request.json();
    
    // Validate with Zod
    const result = createSubdomainSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    // Normalize subdomain (lowercase, remove spaces)
    const normalizedName = result.data.name.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

    // Check availability
    const { data: existing, error: checkError } = await supabase
      .from("subdomains")
      .select("id")
      .eq("name", normalizedName)
      .maybeSingle();
      
    if (checkError) {
      console.error("Database error during availability check:", checkError);
      return NextResponse.json(
        { error: "Failed to check availability" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "Subdomain is already taken" },
        { status: 409 }
      );
    }

    // Check user limit
    const { count, error: countError } = await supabase
      .from("subdomains")
      .select("id", { count: "exact" })
      .eq("user_id", user.id);
      
    if (countError) {
      return NextResponse.json(
        { error: "Failed to verify subdomain limits" },
        { status: 500 }
      );
    }

    if (count !== null && count >= 3) {
      return NextResponse.json(
        { error: "You have reached the limit of 3 subdomains" },
        { status: 403 }
      );
    }

    // Actually create the subdomain record
    const { data: newSubdomain, error: createError } = await supabase
      .from("subdomains")
      .insert({
        name: normalizedName,
        user_id: user.id,
        status: "active",
        ssl_status: "pending"
      })
      .select()
      .single();

    if (createError) {
      console.error("Database error during insert:", createError);
      return NextResponse.json(
        { error: "Failed to create subdomain" },
        { status: 500 }
      );
    }
    
    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action: "subdomain_created",
      details: { name: normalizedName }
    });

    return NextResponse.json({ data: newSubdomain }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
