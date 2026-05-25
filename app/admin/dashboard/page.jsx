import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import { getSupabaseAdmin } from "@/lib/supabase";
import { toBlog } from "@/lib/blog-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let totalBlogs = 0;
  let subscribers = 0;
  let recent = [];
  let views = { total: 0, avg: 0 };

  try {
    const supabase = getSupabaseAdmin();
    const [blogsRes, subscribersRes] = await Promise.all([
      supabase.from("blogs").select("*, categories(*)").order("created_at", { ascending: false }),
      supabase.from("subscribers").select("id", { count: "exact", head: true }).eq("is_active", true)
    ]);
    const blogs = blogsRes.data || [];
    totalBlogs = blogs.length;
    subscribers = subscribersRes.count || 0;
    recent = blogs.slice(0, 4).map(toBlog);
    views.total = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
    views.avg = blogs.length ? blogs.reduce((sum, blog) => sum + (blog.read_time || 0), 0) / blogs.length : 0;
  } catch {}

  const stats = [
    ["Total Blogs", totalBlogs, "↑ active library"],
    ["Monthly Views", views.total || 0, "↑ traffic tracked"],
    ["Subscribers", subscribers, "↑ newsletter audience"],
    ["Avg Read Time", `${Math.round(views.avg || 0)}m`, "story depth"]
  ];

  return (
    <>
      <TopBar title="Dashboard" />
      <main className="space-y-8 p-5 md:ml-72 md:p-12">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value, hint]) => (
            <div key={label} className="rounded-lg border border-stone-200 bg-white p-7">
              <p className="text-sm font-bold uppercase tracking-wide text-stone-500">{label}</p>
              <p className="mt-4 font-heading text-5xl font-bold">{value}</p>
              <p className="mt-3 text-green-700">{hint}</p>
            </div>
          ))}
        </div>
        <section className="rounded-lg border border-stone-200 bg-white p-7">
          <h2 className="text-lg font-bold uppercase tracking-wide text-stone-500">Recent Posts</h2>
          <div className="mt-5 divide-y divide-stone-200">
            {recent.map((post) => (
              <div key={post._id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-lg font-semibold">{post.title}</p>
                  <p className="text-stone-500">{post.category?.name || "Uncategorized"} · {post.readTime} min read</p>
                </div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-sm capitalize">{post.status}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["Write New Blog", "/admin/blogs/new"],
            ["Upload Media", "/admin/media"],
            ["SEO Audit", "/admin/settings"],
            ["Send Newsletter", "/admin/settings"]
          ].map(([label, href]) => <Link key={label} href={href} className="rounded-lg bg-ink p-5 text-center font-bold text-white">{label}</Link>)}
        </section>
      </main>
    </>
  );
}
