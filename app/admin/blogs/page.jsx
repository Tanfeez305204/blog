"use client";

import { useCallback, useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import BlogTable from "@/components/admin/BlogTable";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "all", category: "all", page: 1 });
  const [pages, setPages] = useState(1);

  const loadBlogs = useCallback(async () => {
    const query = new URLSearchParams({ ...filters, limit: 10 });
    const blogRes = await fetch(`/api/blogs?${query}`);
    const data = await blogRes.json();
    setBlogs(data.blogs || []);
    setPages(data.pages || 1);
  }, [filters]);

  useEffect(() => {
    fetch("/api/categories").then((res) => res.json()).then(setCategories);
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadBlogs, 250);
    return () => clearTimeout(timer);
  }, [loadBlogs]);

  return (
    <>
      <TopBar title="All Blogs" />
      <main className="space-y-5 p-5 md:ml-72 md:p-12">
        <div className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 md:grid-cols-3">
          <input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} placeholder="Search title" className="rounded border border-stone-300 p-3" />
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })} className="rounded border border-stone-300 p-3">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })} className="rounded border border-stone-300 p-3">
            <option value="all">All categories</option>
            {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
        </div>
        <BlogTable blogs={blogs} onDeleted={loadBlogs} />
        <div className="flex items-center justify-end gap-3">
          <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} className="rounded border px-4 py-2 disabled:opacity-40">Prev</button>
          <span>Page {filters.page} of {pages}</span>
          <button disabled={filters.page >= pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} className="rounded border px-4 py-2 disabled:opacity-40">Next</button>
        </div>
      </main>
    </>
  );
}
