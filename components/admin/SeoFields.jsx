"use client";

import { seoScore } from "@/lib/utils";

export default function SeoFields({ title, content, seo, onChange }) {
  const score = seoScore({ title, content, seo });

  function update(key, value) {
    onChange({ ...seo, [key]: value });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl font-bold">SEO</h3>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold">{score}/100</span>
      </div>
      <label className="block text-sm font-semibold">
        Meta title
        <input value={seo.metaTitle || ""} onChange={(e) => update("metaTitle", e.target.value)} className="mt-2 w-full rounded border border-stone-300 p-3" />
      </label>
      <label className="block text-sm font-semibold">
        Meta description
        <textarea maxLength={160} value={seo.metaDescription || ""} onChange={(e) => update("metaDescription", e.target.value)} className="mt-2 h-24 w-full rounded border border-stone-300 p-3" />
        <span className="text-xs text-stone-500">{(seo.metaDescription || "").length}/160</span>
      </label>
      <label className="block text-sm font-semibold">
        Focus keyword
        <input value={seo.focusKeyword || ""} onChange={(e) => update("focusKeyword", e.target.value)} className="mt-2 w-full rounded border border-stone-300 p-3" />
      </label>
      <label className="block text-sm font-semibold">
        OG image
        <input value={seo.ogImage || ""} onChange={(e) => update("ogImage", e.target.value)} className="mt-2 w-full rounded border border-stone-300 p-3" />
      </label>
    </div>
  );
}
