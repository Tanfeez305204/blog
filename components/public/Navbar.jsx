import Link from "next/link";
import { Search } from "lucide-react";

export default function Navbar({ categories = [] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link href="/" className="font-heading text-3xl font-bold">Qalam</Link>
        <nav className="hidden items-center gap-6 md:flex">
          {categories.slice(0, 6).map((cat) => (
            <Link key={cat._id} href={`/category/${cat.slug}`} className="text-sm font-semibold text-stone-600 hover:text-accent">
              {cat.name}
            </Link>
          ))}
        </nav>
        <Link href="/search" aria-label="Search" className="rounded-full border border-stone-300 p-3">
          <Search size={18} />
        </Link>
      </div>
    </header>
  );
}
