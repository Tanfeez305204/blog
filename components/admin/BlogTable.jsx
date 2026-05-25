"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { Edit, Eye, Trash2 } from "lucide-react";

const badge = {
  published: "bg-green-100 text-green-700",
  draft: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700"
};

export default function BlogTable({ blogs = [], onDeleted }) {
  async function remove(id) {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Post deleted");
      onDeleted?.();
    } else {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
      <table className="w-full min-w-[840px] text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            <th className="p-4"><input type="checkbox" aria-label="Select all" /></th>
            <th className="p-4">Title</th>
            <th className="p-4">Category</th>
            <th className="p-4">Author</th>
            <th className="p-4">Date</th>
            <th className="p-4">Views</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} className="border-t border-stone-100">
              <td className="p-4"><input type="checkbox" aria-label={`Select ${blog.title}`} /></td>
              <td className="p-4 font-semibold">{blog.title}</td>
              <td className="p-4 text-stone-600">{blog.category?.name || "Uncategorized"}</td>
              <td className="p-4 text-stone-600">{blog.author}</td>
              <td className="p-4 text-stone-600">{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td className="p-4 text-stone-600">{blog.views || 0}</td>
              <td className="p-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge[blog.status]}`}>{blog.status}</span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Link className="rounded border p-2 hover:bg-stone-50" href={`/blog/${blog.language || "english"}/${blog.slug}`} aria-label="Preview"><Eye size={16} /></Link>
                  <Link className="rounded border p-2 hover:bg-stone-50" href={`/admin/blogs/edit/${blog._id}`} aria-label="Edit"><Edit size={16} /></Link>
                  <button className="rounded border p-2 text-red-600 hover:bg-red-50" onClick={() => remove(blog._id)} aria-label="Delete"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
          {!blogs.length && (
            <tr><td colSpan="8" className="p-8 text-center text-stone-500">No posts found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
