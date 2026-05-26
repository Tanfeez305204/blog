
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fromBlogPayload, listBlogs, toBlog, updateCategoryPostCount } from "@/lib/blog-data";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendNotification } from "@/lib/sendNotification";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  try {
    const { blogs, total } = await listBlogs({
      page,
      limit,
      status: searchParams.get("status"),
      category: searchParams.get("category"),
      search: searchParams.get("search"),
      language: searchParams.get("language"),
      publicOnly: searchParams.get("public") === "true"
    });

    return NextResponse.json({ blogs, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ blogs: [], total: 0, page, pages: 0 });
  }
}

  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const payload = fromBlogPayload(await request.json());
  const { data, error } = await supabase.from("blogs").insert(payload).select("*, categories(*)").single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  await updateCategoryPostCount(data.category_id);

  // Send OneSignal notification to all subscribers
  try {
    const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${data.language || "en"}/${data.slug}`;
    await sendNotification(
      `New Blog Published: ${data.title}`,
      data.summary || "Check out our latest blog post!",
      blogUrl
    );
  } catch (e) {
    // Log notification error but don't block blog creation
    console.error("OneSignal notification error:", e);
  }

  return NextResponse.json(toBlog(data), { status: 201 });
}
