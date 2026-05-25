import Link from "next/link";
import { Search } from "lucide-react";

export default function Navbar({ categories = [] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-cream/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-heading text-2xl sm:text-3xl font-bold whitespace-nowrap">Qalam</Link>
          
          <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto flex-1 px-2 -mx-2">
            {categories.slice(0, 8).map((cat) => (
              <Link 
                key={cat._id} 
                href={`/category/${cat.slug}`} 
                className="text-xs sm:text-sm font-semibold text-stone-600 hover:text-accent transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
          
          <Link href="/search" aria-label="Search" className="rounded-full border border-stone-300 p-2.5 sm:p-3 flex-shrink-0">
            <Search size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
