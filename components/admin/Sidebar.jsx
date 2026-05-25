"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, Folder, Home, Image, LayoutDashboard, PlusCircle, Search, Settings } from "lucide-react";

const items = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, group: "MAIN" },
  { label: "All Blogs", href: "/admin/blogs", icon: FileText, group: "MAIN" },
  { label: "New Post", href: "/admin/blogs/new", icon: PlusCircle, group: "MAIN" },
  { label: "Categories", href: "/admin/categories", icon: Folder, group: "MANAGE" },
  { label: "Media", href: "/admin/media", icon: Image, group: "MANAGE" },
  { label: "SEO Tools", href: "/admin/settings", icon: Search, group: "MANAGE" },
  { label: "Preview Site", href: "/", icon: Home, group: "SITE" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, group: "SITE" },
  { label: "Settings", href: "/admin/settings", icon: Settings, group: "SITE" }
];

export default function Sidebar() {
  const pathname = usePathname();
  let group = "";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-ink text-stone-200 md:flex">
      <div className="border-b border-white/10 p-8">
        <Link href="/admin/dashboard" className="font-heading text-4xl font-bold text-white">
          Qalam
        </Link>
        <p className="mt-1 tracking-[0.28em] text-stone-400">BLOG STUDIO</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-8">
        {items.map((item) => {
          const Icon = item.icon;
          const showGroup = group !== item.group;
          group = item.group;
          const active = pathname === item.href;
          return (
            <div key={item.href + item.label}>
              {showGroup && <p className="px-8 pb-3 pt-5 text-xs tracking-[0.28em] text-stone-500">{item.group}</p>}
              <Link
                href={item.href}
                className={`flex items-center gap-4 border-l-4 px-8 py-4 text-lg transition ${
                  active ? "border-accent bg-[#3b1808] text-white" : "border-transparent text-stone-300 hover:bg-white/5"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-8">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-lg font-bold text-white">AK</div>
          <div>
            <p className="font-semibold text-white">Admin</p>
            <p className="text-sm text-stone-500">qalam.blog</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
