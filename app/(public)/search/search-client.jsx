"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/public/BlogCard";

export default function SearchClient() {
  const [q, setQ] = useState("");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/blogs?public=true&limit=24&search=${encodeURIComponent(q)}`);
      const data = await res.json();
      setBlogs(data.blogs || []);
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12">
      <h1 className="font-heading text-5xl font-bold">Search</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} autoFocus placeholder="Search by title, tag, or content" className="mt-8 w-full rounded-lg border border-stone-300 bg-white p-4 text-lg" />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
      </div>
      {!blogs.length && <p className="mt-10 text-stone-500">No results found.</p>}
    </main>
  );
}
