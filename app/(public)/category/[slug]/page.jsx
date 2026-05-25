import { notFound } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import BlogCard from "@/components/public/BlogCard";
import Footer from "@/components/public/Footer";
import { getSupabaseAdmin } from "@/lib/supabase";
import { listBlogs, listCategories, toCategory } from "@/lib/blog-data";

export const revalidate = 60;

async function getCategory(slug) {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from("categories").select("*").eq("slug", slug).single();
    return toCategory(data);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const category = await getCategory(params.slug);
  if (!category) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: `${category.name} | Qalam Blog Studio`,
    description: category.description,
    alternates: { canonical: `${siteUrl}/category/${category.slug}` }
  };
}

export default async function CategoryPage({ params }) {
  const category = await getCategory(params.slug);
  if (!category) notFound();

  let categories = [];
  let blogs = [];
  try {
    [categories, { blogs }] = await Promise.all([
      listCategories(),
      listBlogs({ publicOnly: true, category: category._id, limit: 48 })
    ]);
  } catch {}

  return (
    <>
      <Navbar categories={categories} />
      <main className="mx-auto max-w-7xl px-5 py-12">
        <h1 className="font-heading text-5xl font-bold">{category.emoji} {category.name}</h1>
        <p className="mt-3 max-w-2xl text-stone-600">{category.description}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      </main>
      <Footer />
    </>
  );
}
