import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function toComment(row) {
  return {
    _id: row.id,
    id: row.id,
    blog: row.blog_id,
    name: row.name,
    message: row.message,
    isApproved: row.is_approved,
    createdAt: row.created_at
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("blog_id", searchParams.get("blog"))
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json([]);
  return NextResponse.json((data || []).map(toComment));
}

export async function POST(request) {
  const body = await request.json();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("comments")
    .insert({ blog_id: body.blog, name: body.name, message: body.message })
    .select("*")
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json(toComment(data), { status: 201 });
}
