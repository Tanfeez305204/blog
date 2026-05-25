import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const supabase = getSupabaseAdmin();
    
    // Fetch all published blogs and categories
    const [blogsRes, categoriesRes] = await Promise.all([
      supabase
        .from("blogs")
        .select("slug, updated_at, language")
        .eq("status", "published"),
      supabase.from("categories").select("slug, updated_at")
    ]);

    const blogs = blogsRes.data || [];
    const categories = categoriesRes.data || [];

    // Build sitemap XML
    const urls = [
      // Homepage
      {
        url: baseUrl,
        lastmod: new Date().toISOString().split("T")[0],
        priority: "1.0",
        changefreq: "daily"
      },
      // Search page
      {
        url: `${baseUrl}/search`,
        lastmod: new Date().toISOString().split("T")[0],
        priority: "0.8",
        changefreq: "weekly"
      },
      // Privacy page
      {
        url: `${baseUrl}/privacy`,
        lastmod: new Date().toISOString().split("T")[0],
        priority: "0.5",
        changefreq: "monthly"
      },
      // Terms page
      {
        url: `${baseUrl}/terms`,
        lastmod: new Date().toISOString().split("T")[0],
        priority: "0.5",
        changefreq: "monthly"
      },
      // Category pages
      ...categories.map((cat) => ({
        url: `${baseUrl}/category/${cat.slug}`,
        lastmod: cat.updated_at ? cat.updated_at.split("T")[0] : new Date().toISOString().split("T")[0],
        priority: "0.8",
        changefreq: "weekly"
      })),
      // Blog posts
      ...blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.language || "english"}/${blog.slug}`,
        lastmod: blog.updated_at ? blog.updated_at.split("T")[0] : new Date().toISOString().split("T")[0],
        priority: "0.7",
        changefreq: "weekly"
      }))
    ];

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${urls
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
      }
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new NextResponse("Sitemap generation failed", { status: 500 });
  }
}
