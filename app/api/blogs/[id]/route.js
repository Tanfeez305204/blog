import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fromBlogPayload, getBlogByIdOrSlug, toBlog, updateCategoryPostCount } from "@/lib/blog-data";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function canWrite() {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user);
}

export async function GET(_request, { params }) {
  const blog = await getBlogByIdOrSlug(params.id);
  if (!blog) return NextResponse.json(null);
  return NextResponse.json(blog);
}

export async function PUT(request, { params }) {
  if (!(await canWrite())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const previous = await getBlogByIdOrSlug(params.id);
  const payload = fromBlogPayload(await request.json());
  const { data, error } = await supabase
    .from("blogs")
    .update(payload)
    .eq("id", params.id)
    .select("*, categories(*)")
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  await updateCategoryPostCount(previous?.category?._id);
  await updateCategoryPostCount(data.category_id);
  return NextResponse.json(toBlog(data));
}

export async function DELETE(_request, { params }) {
  if (!(await canWrite())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const previous = await getBlogByIdOrSlug(params.id);
  const { error } = await supabase.from("blogs").delete().eq("id", params.id);
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  await updateCategoryPostCount(previous?.category?._id);
  return NextResponse.json({ ok: true });
}
