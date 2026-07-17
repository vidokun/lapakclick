import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isAdmin(user: { user_metadata?: { role?: string } } | null): boolean {
  return user?.user_metadata?.role === "admin";
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: patterns, error } = await supabase
      .from("blacklist")
      .select("pattern")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch blacklist" }, { status: 500 });
    }

    return NextResponse.json({ data: patterns });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const raw = body?.pattern;

    if (!raw || typeof raw !== "string") {
      return NextResponse.json({ error: "Pattern is required and must be a string" }, { status: 400 });
    }

    const pattern = raw.toLowerCase().trim();

    if (!pattern) {
      return NextResponse.json({ error: "Pattern cannot be empty" }, { status: 400 });
    }

    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(pattern)) {
      return NextResponse.json({ error: "Pattern must be alphanumeric with hyphens only" }, { status: 400 });
    }

    if (pattern.length < 2 || pattern.length > 63) {
      return NextResponse.json({ error: "Pattern must be between 2 and 63 characters" }, { status: 400 });
    }

    const { data: inserted, error: insertError } = await supabase
      .from("blacklist")
      .insert({ pattern, created_by: user.id })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json({ error: "Pattern already exists in blacklist" }, { status: 409 });
      }
      console.error("Database error:", insertError);
      return NextResponse.json({ error: "Failed to create blacklist entry" }, { status: 500 });
    }

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const queryPattern = url.searchParams.get("pattern");

    let pattern: string | undefined;

    if (queryPattern) {
      pattern = queryPattern;
    } else {
      const body = await request.json().catch(() => ({}));
      pattern = body?.pattern;
    }

    if (!pattern || typeof pattern !== "string") {
      return NextResponse.json({ error: "Pattern is required" }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from("blacklist")
      .delete()
      .eq("pattern", pattern);

    if (deleteError) {
      console.error("Database error:", deleteError);
      return NextResponse.json({ error: "Failed to delete blacklist entry" }, { status: 500 });
    }

    return NextResponse.json({ data: { pattern } });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
