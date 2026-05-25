"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CommentSection({ blogId }) {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", message: "" });

  async function load() {
    const res = await fetch(`/api/comments?blog=${blogId}`);
    if (res.ok) setComments(await res.json());
  }

  useEffect(() => { load(); }, [blogId]);

  async function submit(e) {
    e.preventDefault();
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, blog: blogId })
    });
    if (res.ok) {
      toast.success("Comment added");
      setForm({ name: "", message: "" });
      load();
    }
  }

  return (
    <section className="mt-12 border-t border-stone-200 pt-8">
      <h2 className="font-heading text-3xl font-bold">Comments</h2>
      <form onSubmit={submit} className="mt-5 grid gap-3">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="rounded border border-stone-300 p-3" />
        <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" className="h-28 rounded border border-stone-300 p-3" />
        <button className="w-fit rounded-lg bg-accent px-5 py-3 font-bold text-white">Post Comment</button>
      </form>
      <div className="mt-8 space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="font-semibold">{comment.name}</p>
            <p className="mt-2 text-stone-700">{comment.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
