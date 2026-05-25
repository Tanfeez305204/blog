"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TopBar from "@/components/admin/TopBar";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", emoji: "✦", description: "" });

  async function load() {
    setCategories(await fetch("/api/categories").then((r) => r.json()));
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      toast.success("Category added");
      setForm({ name: "", emoji: "✦", description: "" });
      load();
    }
  }

  async function remove(id) {
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    toast.success("Category deleted");
    load();
  }

  return (
    <>
      <TopBar title="Categories" />
      <main className="space-y-8 p-5 md:ml-72 md:p-12">
        <form onSubmit={submit} className="grid gap-3 rounded-lg border border-stone-200 bg-white p-5 md:grid-cols-[90px_1fr_2fr_auto]">
          <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="rounded border border-stone-300 p-3" />
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Name" className="rounded border border-stone-300 p-3" />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded border border-stone-300 p-3" />
          <button className="rounded bg-accent px-5 font-bold text-white">Add</button>
        </form>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat._id} className="rounded-lg border border-stone-200 bg-white p-6">
              <div className="text-4xl">{cat.emoji}</div>
              <h2 className="mt-4 font-heading text-3xl font-bold">{cat.name}</h2>
              <p className="mt-2 text-stone-600">{cat.description}</p>
              <p className="mt-4 text-sm font-semibold">{cat.postCount || 0} posts</p>
              <button onClick={() => remove(cat._id)} className="mt-5 rounded border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">Delete</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
