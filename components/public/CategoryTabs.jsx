import Link from "next/link";

export default function CategoryTabs({ categories = [] }) {
  return (
    <div className="flex gap-3 overflow-x-auto py-4">
      <Link href="/" className="whitespace-nowrap rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">All</Link>
      {categories.map((cat) => (
        <Link key={cat._id} href={`/category/${cat.slug}`} className="whitespace-nowrap rounded-full border border-stone-300 bg-white px-5 py-2 text-sm font-semibold">
          {cat.emoji} {cat.name}
        </Link>
      ))}
    </div>
  );
}
