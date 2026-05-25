import { getSupabaseAdmin } from "@/lib/supabase";
import { calculateReadTime, slugify } from "@/lib/utils";

const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function toCategory(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    slug: row.slug,
    emoji: row.emoji,
    description: row.description || "",
    postCount: row.post_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function toBlog(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content || "",
    excerpt: row.excerpt || "",
    featuredImage: {
      url: row.featured_image_url || "",
      publicId: row.featured_image_public_id || ""
    },
    category: toCategory(row.categories || row.category),
    tags: row.tags || [],
    author: row.author || "Qalam Editorial",
    status: row.status || "draft",
    scheduledAt: row.scheduled_at,
    seo: {
      metaTitle: row.seo_meta_title || "",
      metaDescription: row.seo_meta_description || "",
      ogImage: row.seo_og_image || "",
      focusKeyword: row.seo_focus_keyword || ""
    },
    views: row.views || 0,
    readTime: row.read_time || 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function fromBlogPayload(payload) {
  const content = payload.content || "";
  const excerpt = (payload.excerpt || content.replace(/<[^>]*>/g, " ").trim()).slice(0, 160);
  const status =
    payload.status === "scheduled" &&
    payload.scheduledAt &&
    new Date(payload.scheduledAt) <= new Date()
      ? "published"
      : payload.status || "draft";

  return {
    title: payload.title,
    slug: payload.slug || slugify(payload.title),
    content,
    excerpt,
    featured_image_url: payload.featuredImage?.url || "",
    featured_image_public_id: payload.featuredImage?.publicId || "",
    category_id: payload.category?._id || payload.category || null,
    tags: payload.tags || [],
    author: payload.author || "Qalam Editorial",
    status,
    scheduled_at: payload.scheduledAt || null,
    seo_meta_title: payload.seo?.metaTitle || "",
    seo_meta_description: payload.seo?.metaDescription || "",
    seo_og_image: payload.seo?.ogImage || "",
    seo_focus_keyword: payload.seo?.focusKeyword || "",
    read_time: calculateReadTime(content),
    updated_at: new Date().toISOString()
  };
}

export async function publishDueScheduledPosts() {
  const supabase = getSupabaseAdmin();
  await supabase
    .from("blogs")
    .update({ status: "published", updated_at: new Date().toISOString() })
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString());
}

export async function listBlogs({ publicOnly = false, status, category, search, page = 1, limit = 10 } = {}) {
  const supabase = getSupabaseAdmin();
  await publishDueScheduledPosts();

  let query = supabase
    .from("blogs")
    .select("*, categories(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (publicOnly) query = query.eq("status", "published");
  else if (status && status !== "all") query = query.eq("status", status);
  if (category && category !== "all") query = query.eq("category_id", category);
  if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);

  const { data, count, error } = await query;
  if (error) throw error;
  return { blogs: (data || []).map(toBlog), total: count || 0 };
}

export async function getBlogByIdOrSlug(idOrSlug, publicOnly = false) {
  const supabase = getSupabaseAdmin();
  let query = supabase.from("blogs").select("*, categories(*)").limit(1);
  query = uuidRe.test(idOrSlug) ? query.eq("id", idOrSlug) : query.eq("slug", idOrSlug);
  if (publicOnly) query = query.eq("status", "published");
  const { data, error } = await query.single();
  if (error) return null;
  return toBlog(data);
}

export async function listCategories() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return (data || []).map(toCategory);
}

export async function updateCategoryPostCount(categoryId) {
  if (!categoryId) return;
  const supabase = getSupabaseAdmin();
  const { count } = await supabase
    .from("blogs")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);
  await supabase.from("categories").update({ post_count: count || 0 }).eq("id", categoryId);
}
