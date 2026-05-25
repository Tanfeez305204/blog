import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import BlogCard from "@/components/public/BlogCard";
import ViewTracker from "@/components/public/ViewTracker";
import ShareButtons from "@/components/public/ShareButtons";
import CommentSection from "@/components/public/CommentSection";
import LanguageSwitcher from "@/components/public/LanguageSwitcher";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getBlogByIdOrSlug, listCategories, toBlog } from "@/lib/blog-data";

export const revalidate = 60;

async function getBlog(slug, language) {
  try {
    return await getBlogByIdOrSlug(slug, true, language);
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from("blogs").select("slug, language").eq("status", "published");
    return (data || []).map((blog) => ({ slug: blog.slug, language: blog.language || "english" }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug, params.language);
  if (!blog) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${siteUrl}/blog/${params.language}/${blog.slug}`;
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
  const blog = await getBlog(params.slug, params.language);
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
        .eq("language", params.language)
        .eq("category_id", blog.category?._id)
        .neq("id", blog._id)
        .limit(3),
      supabase
        .from("blogs")
        .select("title, slug, created_at, language")
        .eq("status", "published")
        .eq("language", params.language)
        .order("created_at")
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
    mainEntityOfPage: `${siteUrl}/blog/${params.language}/${blog.slug}`
  };

  return (
    <>
      <Navbar categories={categories} />
      <ViewTracker id={blog._id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="inline-block mb-4">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-accent">
              {blog.category?.name}
            </span>
          </div>
          <style>{`
            @keyframes gradientShift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            .blog-title {
              background: linear-gradient(135deg, #292524 0%, #ea580c 50%, #292524 100%);
              background-size: 200% 200%;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
          `}</style>
          <h1 className="blog-title font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6 cursor-default">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-stone-600 border-b border-stone-100 pb-6">
            <div className="flex items-center gap-2">
              <span className="inline-block w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-semibold text-accent">
                {blog.author?.[0]?.toUpperCase()}
              </span>
              <span className="font-semibold text-stone-900">{blog.author}</span>
            </div>
            <span className="text-sm font-medium text-stone-500">•</span>
            <span className="text-sm font-medium">{blog.readTime} min read</span>
            <span className="text-sm font-medium text-stone-500">•</span>
            <time className="text-sm font-medium text-stone-500">{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featuredImage?.url && (
          <img 
            src={blog.featuredImage.url} 
            alt={blog.title} 
            className="mt-10 w-full max-h-[600px] object-cover rounded-2xl shadow-lg" 
          />
        )}

        {/* Content */}
        <div className="prose-blog mt-12 max-w-none text-lg leading-8 text-stone-700" dangerouslySetInnerHTML={{ __html: blog.content }} />

        {/* Language Switcher */}
        <LanguageSwitcher slug={params.slug} currentLanguage={params.language} />

        {/* Share Section */}
        <div className="mt-14 py-8 border-y border-stone-200">
          <p className="text-sm font-semibold text-stone-600 mb-4">Share this article</p>
          <ShareButtons title={blog.title} />
        </div>

        {/* Navigation */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {prev ? (
            <Link 
              href={`/blog/${params.language}/${prev.slug}`}
              className="group block p-6 rounded-xl border border-stone-200 hover:border-accent/30 hover:shadow-lg transition-all"
            >
              <p className="text-sm font-semibold text-accent mb-2">← Previous</p>
              <p className="font-heading text-lg font-bold text-stone-900 group-hover:text-accent transition-colors line-clamp-2">
                {prev.title}
              </p>
            </Link>
          ) : <div />}
          {next ? (
            <Link 
              href={`/blog/${params.language}/${next.slug}`}
              className="group block p-6 rounded-xl border border-stone-200 hover:border-accent/30 hover:shadow-lg transition-all text-right"
            >
              <p className="text-sm font-semibold text-accent mb-2">Next →</p>
              <p className="font-heading text-lg font-bold text-stone-900 group-hover:text-accent transition-colors line-clamp-2">
                {next.title}
              </p>
            </Link>
          ) : <div />}
        </div>

        {/* Comments */}
        <div className="mt-14">
          <CommentSection blogId={blog._id} />
        </div>
      </main>
      {!!related.length && (
        <section className="mx-auto max-w-7xl px-5 py-16 border-t border-stone-200">
          <div className="mb-12">
            <h2 className="font-heading text-4xl font-bold text-stone-900 mb-2">Related Blogs</h2>
            <p className="text-stone-600">Explore more articles from the same category</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {related.map((item) => <BlogCard key={item._id} blog={item} />)}
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}
