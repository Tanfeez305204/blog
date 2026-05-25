"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch("/api/analytics").then((r) => r.json()).then(setData); }, []);
  const max = Math.max(1, ...(data?.categories || []).map((c) => c.views));

  return (
    <>
      <TopBar title="Analytics" />
      <main className="space-y-8 p-5 md:ml-72 md:p-12">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Total Views", data?.totalViews || 0],
            ["Bounce Rate", data?.bounceRate || "0%"],
            ["Avg Session Time", data?.avgSessionTime || "0m"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-stone-200 bg-white p-6">
              <p className="text-sm font-bold uppercase text-stone-500">{label}</p>
              <p className="mt-3 font-heading text-4xl font-bold">{value}</p>
            </div>
          ))}
        </div>
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="font-heading text-3xl font-bold">Top 5 Posts</h2>
          <div className="mt-5 divide-y">
            {(data?.topPosts || []).map((post) => <p key={post._id} className="py-3">{post.title} <span className="text-stone-500">· {post.views} views</span></p>)}
          </div>
        </section>
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="font-heading text-3xl font-bold">Traffic by Category</h2>
          <div className="mt-6 space-y-4">
            {(data?.categories || []).map((cat) => (
              <div key={cat._id || "uncategorized"}>
                <div className="mb-1 flex justify-between text-sm"><span>{cat._id || "Uncategorized"}</span><span>{cat.views}</span></div>
                <div className="h-3 rounded-full bg-stone-100"><div className="h-3 rounded-full bg-accent" style={{ width: `${(cat.views / max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
