import Link from "next/link";

export default function HeroBanner({ post }) {
  if (!post) {
    return (
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <h1 className="font-heading text-5xl font-bold">Qalam Blog Studio</h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-300">Daily essays, guides, and ideas for sharp readers.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-orange-300">{post.category?.name || "Featured"}</p>
          <Link href={`/blog/${post.slug}`}>
            <h1 className="font-heading text-5xl font-bold leading-tight md:text-6xl">{post.title}</h1>
          </Link>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-300">{post.excerpt}</p>
          <p className="mt-6 text-sm text-stone-400">{post.author} · {post.readTime} min read</p>
        </div>
        <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-lg bg-white/5">
          {post.featuredImage?.url ? (
            <img src={post.featuredImage.url} alt={post.title} className="h-[380px] w-full object-cover" />
          ) : (
            <div className="grid h-[380px] place-items-center text-8xl">✍️</div>
          )}
        </Link>
      </div>
    </section>
  );
}
