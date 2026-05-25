import Link from "next/link";

export default function BlogCard({ blog }) {
  const language = blog.language || "english";
  return (
    <article className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent/30">
      <Link href={`/blog/${language}/${blog.slug}`} className="block overflow-hidden">
        {blog.featuredImage?.url ? (
          <img 
            src={blog.featuredImage.url} 
            alt={blog.title} 
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        ) : (
          <div className="grid h-48 place-items-center bg-gradient-to-br from-orange-50 to-amber-50 text-6xl transition-transform duration-300 group-hover:scale-105">
            {blog.category?.emoji || "🖋️"}
          </div>
        )}
      </Link>
      <div className="flex flex-col p-6">
        <Link href={`/category/${blog.category?.slug || "uncategorized"}`} className="inline-block w-fit text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:text-accent/80">
          {blog.category?.name || "Uncategorized"}
        </Link>
        <Link href={`/blog/${language}/${blog.slug}`}>
          <h2 className="mt-3 font-heading text-xl font-bold leading-tight text-stone-900 transition-colors group-hover:text-accent line-clamp-2">
            {blog.title}
          </h2>
        </Link>
        <p className="mt-4 flex-grow line-clamp-3 text-sm leading-6 text-stone-600">{blog.excerpt}</p>
        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
          <p className="text-xs text-stone-500 font-medium">
            <span className="font-semibold text-stone-700">{blog.author}</span> · {blog.readTime} min
          </p>
          <span className="text-xs text-accent font-semibold">→</span>
        </div>
      </div>
    </article>
  );
}
