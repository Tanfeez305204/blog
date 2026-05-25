import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 mb-8">
          <div>
            <p className="font-heading text-2xl font-bold mb-4">Qalam</p>
            <p className="text-sm text-stone-600">Daily essays, guides, and ideas for sharp readers.</p>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 mb-4">Site</h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/search" className="hover:text-accent transition-colors">Search</Link></li>
              <li><Link href="/admin/login" className="hover:text-accent transition-colors">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 mb-4">Newsletter</h3>
            <p className="text-sm text-stone-600 mb-3">Subscribe for latest articles</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm placeholder-stone-400 focus:border-accent focus:outline-none" />
              <button className="rounded bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-200 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-stone-600">&copy; {new Date().getFullYear()} Qalam Blog Studio. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-stone-600">
            <a href="#" className="hover:text-accent transition-colors">Twitter</a>
            <a href="#" className="hover:text-accent transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-accent transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
