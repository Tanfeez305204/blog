import Link from "next/link";
import Image from "next/image";

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

  const language = post.language || "english";

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="mb-4 text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-orange-300">{post.category?.name || "Featured"}</p>
          <Link href={`/blog/${language}/${post.slug}`}>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">{post.title}</h1>
          </Link>
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-8 text-stone-300">{post.excerpt}</p>
          <p className="mt-6 text-sm text-stone-400">{post.author} · {post.readTime} min read</p>
        </div>
        <Link href={`/blog/${language}/${post.slug}`} className="block overflow-hidden rounded-3xl bg-white/5">
          {post.featuredImage?.url ? (
            <div className="relative h-[260px] w-full sm:h-[320px] md:h-[380px]">
              <Image
                src={post.featuredImage.url}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="grid h-[260px] sm:h-[320px] md:h-[380px] place-items-center text-7xl">✍️</div>
          )}
        </Link>
      </div>
    </section>
  );
}
