import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import BlogCard from "@/components/public/BlogCard";
import ViewTracker from "@/components/public/ViewTracker";
import ShareButtons from "@/components/public/ShareButtons";
import CommentSection from "@/components/public/CommentSection";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getBlogByIdOrSlug, listCategories, toBlog } from "@/lib/blog-data";

export const revalidate = 60;

async function getBlog(slug) {
  try {
    return await getBlogByIdOrSlug(slug, true);
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from("blogs").select("slug").eq("status", "published");
    return (data || []).map((blog) => ({ slug: blog.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug);
  if (!blog) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${siteUrl}/blog/${blog.slug}`;
  return {
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: blog.title,
      description: blog.excerpt,
      url,
      images: [blog.seo?.ogImage || blog.featuredImage?.url || "/og.svg"]
    }
  };
}

export default async function BlogDetail({ params }) {
  const blog = await getBlog(params.slug);
  if (!blog) notFound();

  let categories = [];
  let related = [];
  let all = [];
  try {
    const supabase = getSupabaseAdmin();
    const [categoryList, relatedRes, allRes] = await Promise.all([
      listCategories(),
      supabase
        .from("blogs")
        .select("*, categories(*)")
        .eq("status", "published")
        .eq("category_id", blog.category?._id)
        .neq("id", blog._id)
        .limit(3),
      supabase.from("blogs").select("title, slug, created_at").eq("status", "published").order("created_at")
    ]);
    categories = categoryList;
    related = (relatedRes.data || []).map(toBlog);
    all = allRes.data || [];
  } catch {}

  const index = all.findIndex((item) => item.slug === blog.slug);
  const prev = all[index - 1];
  const next = all[index + 1];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage?.url,
    author: { "@type": "Person", name: blog.author },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: `${siteUrl}/blog/${blog.slug}`
  };

  return (
    <>
      <Navbar categories={categories} />
      <ViewTracker id={blog._id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-4xl px-5 py-12">
        <p className="text-sm font-bold uppercase tracking-wide text-accent">{blog.category?.name}</p>
        <h1 className="mt-3 font-heading text-5xl font-bold leading-tight">{blog.title}</h1>
        <p className="mt-5 text-stone-600">{blog.author} · {blog.readTime} min read · {new Date(blog.createdAt).toLocaleDateString()}</p>
        {blog.featuredImage?.url && <img src={blog.featuredImage.url} alt={blog.title} className="mt-8 max-h-[520px] w-full rounded-lg object-cover" />}
        <div className="prose-blog mt-8 max-w-none text-lg" dangerouslySetInnerHTML={{ __html: blog.content }} />
        <div className="mt-10"><ShareButtons title={blog.title} /></div>
        <div className="mt-10 flex justify-between border-y border-stone-200 py-5 text-sm font-semibold">
          {prev ? <Link href={`/blog/${prev.slug}`}>Previous: {prev.title}</Link> : <span />}
          {next ? <Link href={`/blog/${next.slug}`}>Next: {next.title}</Link> : <span />}
        </div>
        <CommentSection blogId={blog._id} />
      </main>
      {!!related.length && (
        <section className="mx-auto max-w-7xl px-5 pb-14">
          <h2 className="font-heading text-3xl font-bold">Related Blogs</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((item) => <BlogCard key={item._id} blog={item} />)}
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}
