import Navbar from "@/components/public/Navbar";
import HeroBanner from "@/components/public/HeroBanner";
import CategoryTabs from "@/components/public/CategoryTabs";
import BlogCard from "@/components/public/BlogCard";
import NewsletterBox from "@/components/public/NewsletterBox";
import Footer from "@/components/public/Footer";
import { listBlogs, listCategories } from "@/lib/blog-data";

export const revalidate = 60;

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: "Qalam Blog Studio | Daily Ideas and Guides",
    description: "Daily essays, guides, and ideas from Qalam Blog Studio.",
    alternates: { canonical: siteUrl },
    openGraph: { title: "Qalam Blog Studio", url: siteUrl, images: ["/og.svg"] }
  };
}

async function getData() {
  try {
    const [{ blogs }, categories] = await Promise.all([
      listBlogs({ publicOnly: true, limit: 12 }),
      listCategories()
    ]);
    return { blogs, categories };
  } catch {
    return { blogs: [], categories: [] };
  }
}

export default async function HomePage() {
  const { blogs, categories } = await getData();
  return (
    <>
      <Navbar categories={categories} />
      <HeroBanner post={blogs[0]} />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <CategoryTabs categories={categories} />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      </main>
      <NewsletterBox />
      <Footer />
    </>
  );
}
