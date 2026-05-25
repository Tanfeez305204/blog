export function slugify(value = "") {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calculateReadTime(html = "") {
  const text = html.replace(/<[^>]*>/g, " ").trim();
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function seoScore({ title = "", content = "", seo = {} }) {
  const keyword = (seo.focusKeyword || "").toLowerCase().trim();
  if (!keyword) return 35;
  let score = 30;
  if (title.toLowerCase().includes(keyword)) score += 20;
  if ((seo.metaTitle || "").toLowerCase().includes(keyword)) score += 15;
  if ((seo.metaDescription || "").toLowerCase().includes(keyword)) score += 15;
  if (content.toLowerCase().includes(keyword)) score += 20;
  return Math.min(100, score);
}
