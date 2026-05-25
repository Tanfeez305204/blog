import { NextResponse } from "next/server";
import { listCategories, toCategory } from "@/lib/blog-data";
import { getSupabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await listCategories());
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  const body = await request.json();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: body.name,
      slug: body.slug || slugify(body.name),
      emoji: body.emoji || "✦",
      description: body.description || ""
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json(toCategory(data), { status: 201 });
}

export async function PUT(request) {
  const supabase = getSupabaseAdmin();
  const { id, ...body } = await request.json();
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: body.name,
      slug: body.slug || (body.name ? slugify(body.name) : undefined),
      emoji: body.emoji,
      description: body.description,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json(toCategory(data));
}

export async function DELETE(request) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const { error } = await supabase.from("categories").delete().eq("id", searchParams.get("id"));
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
