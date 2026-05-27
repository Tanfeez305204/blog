import { NextResponse } from "next/server";

export async function GET(req) {
  const robots = `User-agent: *\nAllow: /\n\nDisallow: /admin/\nDisallow: /api/\nDisallow: /*.json$\nDisallow: /*?*sort=\nDisallow: /*?*filter=\n\nSitemap: https://qalam.website/sitemap.xml\n\nCrawl-delay: 1`;
  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=86400"
    }
  });
}
