"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Eye, LogOut, Menu, Plus } from "lucide-react";

export default function TopBar({ title = "Dashboard" }) {
  return (
    <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-stone-200 bg-cream/95 px-5 backdrop-blur md:ml-72 md:px-12">
      <div className="flex items-center gap-4">
        <button className="rounded border border-stone-300 p-2 md:hidden" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="font-heading text-4xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-3 text-sm font-semibold hover:bg-white">
          <Eye size={18} /> Preview
        </Link>
        <Link href="/admin/blogs/new" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-[#a93808]">
          <Plus size={18} /> New Post
        </Link>
        <button onClick={() => signOut()} className="rounded-lg border border-stone-300 p-3" aria-label="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
