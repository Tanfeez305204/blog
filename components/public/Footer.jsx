import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-cream">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-heading text-2xl font-bold">Qalam</p>
        <div className="flex gap-5 text-sm text-stone-600">
          <Link href="/search">Search</Link>
          <Link href="/admin/login">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
