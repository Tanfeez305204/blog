/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  generateRobotsTxt: false, // We're using dynamic robots.txt route instead
  generateIndexSitemap: false, // We're using dynamic sitemap route instead
  exclude: ["/admin/*", "/api/*", "/sitemap.xml", "/robots.txt"],
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 50000,
  autoLastmod: true,
  sourceDir: "public",
  outDir: "public"
};
