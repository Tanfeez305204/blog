"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RichEditor from "@/components/admin/RichEditor";
import SeoFields from "@/components/admin/SeoFields";
import ImageUpload from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/utils";

const empty = {
  title: "",
  slug: "",
  language: "english",
  content: "",
  excerpt: "",
  featuredImage: { url: "", publicId: "" },
  category: "",
  tags: [],
  author: "Qalam Editorial",
  status: "draft",
  scheduledAt: "",
  seo: { metaTitle: "", metaDescription: "", ogImage: "", focusKeyword: "" }
};

export default function BlogForm({ initial }) {
  const router = useRouter();
  const [post, setPost] = useState(initial || empty);
  const [categories, setCategories] = useState([]);
  const [tag, setTag] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial?._id);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  const score = useMemo(() => {
    const keyword = post.seo.focusKeyword?.toLowerCase();
    if (!keyword) return 35;
    return [post.title, post.content, post.seo.metaTitle, post.seo.metaDescription].reduce(
      (sum, value) => sum + (value?.toLowerCase().includes(keyword) ? 20 : 0),
      20
    );
  }, [post]);

  function update(key, value) {
    setPost((current) => ({ ...current, [key]: value }));
  }

  async function save(status = post.status) {
    setSaving(true);
    const payload = { ...post, status, slug: post.slug || slugify(post.title) };
    const res = await fetch(isEdit ? `/api/blogs/${post._id}` : "/api/blogs", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setSaving(false);
    if (res.ok) {
      toast.success(status === "published" ? "Post published" : "Post saved");
      const data = await res.json();
      router.push(`/admin/blogs/edit/${data._id}`);
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.message || "Save failed");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <section className="space-y-5">
        <input
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value, slug: post.slug || slugify(e.target.value) })}
          placeholder="Post title"
          className="w-full rounded-lg border border-stone-200 bg-white p-4 font-heading text-4xl font-bold outline-accent"
        />
        <input value={post.slug} onChange={(e) => update("slug", slugify(e.target.value))} placeholder="post-slug" className="w-full rounded-lg border border-stone-200 bg-white p-3 text-stone-600" />
        <RichEditor value={post.content} onChange={(content) => update("content", content)} />
      </section>
      <aside className="space-y-5">
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <h3 className="font-heading text-xl font-bold">Publish</h3>
          <select value={post.status} onChange={(e) => update("status", e.target.value)} className="mt-4 w-full rounded border border-stone-300 p-3">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
          {post.status === "scheduled" && (
            <input type="datetime-local" value={post.scheduledAt?.slice?.(0, 16) || ""} onChange={(e) => update("scheduledAt", e.target.value)} className="mt-3 w-full rounded border border-stone-300 p-3" />
          )}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button disabled={saving} onClick={() => save("draft")} className="rounded-lg border border-stone-300 px-4 py-3 font-bold">Save Draft</button>
            <button disabled={saving} onClick={() => save("published")} className="rounded-lg bg-accent px-4 py-3 font-bold text-white">Publish Now</button>
          </div>
          <button disabled={saving} onClick={() => save("scheduled")} className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white">Schedule Post</button>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <h3 className="font-heading text-xl font-bold">Details</h3>
          <select value={post.category?._id || post.category || ""} onChange={(e) => update("category", e.target.value)} className="mt-4 w-full rounded border border-stone-300 p-3">
            <option value="">Select category</option>
            {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.emoji} {cat.name}</option>)}
          </select>
          <select value={post.language || "english"} onChange={(e) => update("language", e.target.value)} className="mt-3 w-full rounded border border-stone-300 p-3">
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="urdu">Urdu</option>
          </select>
          <textarea maxLength={160} value={post.excerpt || ""} onChange={(e) => update("excerpt", e.target.value)} placeholder="Excerpt" className="mt-3 h-24 w-full rounded border border-stone-300 p-3" />
          <input value={post.author || ""} onChange={(e) => update("author", e.target.value)} placeholder="Author" className="mt-3 w-full rounded border border-stone-300 p-3" />
          <div className="mt-3 flex gap-2">
            <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Add tag" className="min-w-0 flex-1 rounded border border-stone-300 p-3" />
            <button type="button" className="rounded bg-ink px-4 text-white" onClick={() => {
              if (tag.trim()) update("tags", [...(post.tags || []), tag.trim()]);
              setTag("");
            }}>Add</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(post.tags || []).map((item) => (
              <button key={item} className="rounded-full bg-orange-50 px-3 py-1 text-sm text-accent" onClick={() => update("tags", post.tags.filter((t) => t !== item))}>{item} ×</button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <h3 className="mb-4 font-heading text-xl font-bold">Featured Image</h3>
          <ImageUpload value={post.featuredImage} onChange={(image) => update("featuredImage", image)} />
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <SeoFields title={post.title} content={post.content} seo={post.seo || empty.seo} onChange={(seo) => update("seo", seo)} />
          <p className="mt-3 text-sm text-stone-500">Live score: {Math.min(100, score)}/100</p>
        </div>
      </aside>
    </div>
  );
}
