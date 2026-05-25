"use client";

import toast from "react-hot-toast";

export default function ShareButtons({ title }) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  return (
    <div className="flex flex-wrap gap-3">
      <a className="rounded-full border px-4 py-2 text-sm font-semibold" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank">
        Twitter
      </a>
      <a className="rounded-full border px-4 py-2 text-sm font-semibold" href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank">
        WhatsApp
      </a>
      <button className="rounded-full border px-4 py-2 text-sm font-semibold" onClick={() => navigator.clipboard.writeText(url).then(() => toast.success("Link copied"))}>
        Copy Link
      </button>
    </div>
  );
}
