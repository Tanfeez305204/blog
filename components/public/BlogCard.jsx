import Link from "next/link";

export default function BlogCard({ blog }) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <Link href={`/blog/${blog.slug}`} className="block">
        {blog.featuredImage?.url ? (
          <img src={blog.featuredImage.url} alt={blog.title} className="h-52 w-full object-cover" />
        ) : (
          <div className="grid h-52 place-items-center bg-orange-50 text-5xl">{blog.category?.emoji || "🖋️"}</div>
        )}
      </Link>
      <div className="p-5">
        <Link href={`/category/${blog.category?.slug || "uncategorized"}`} className="text-xs font-bold uppercase tracking-wide text-accent">
          {blog.category?.name || "Uncategorized"}
        </Link>
        <Link href={`/blog/${blog.slug}`}>
          <h2 className="mt-3 font-heading text-2xl font-bold leading-tight hover:text-accent">{blog.title}</h2>
        </Link>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">{blog.excerpt}</p>
        <p className="mt-5 text-sm text-stone-500">{blog.author} · {blog.readTime} min read</p>
      </div>
    </article>
  );
}
