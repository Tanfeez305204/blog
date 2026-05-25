"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import TopBar from "@/components/admin/TopBar";
import ImageUpload from "@/components/admin/ImageUpload";

export default function MediaPage() {
  const [images, setImages] = useState([]);
  const [uploaded, setUploaded] = useState(null);

  async function load() {
    const data = await fetch("/api/blogs?limit=100").then((r) => r.json());
    setImages((data.blogs || []).map((b) => b.featuredImage).filter((img) => img?.url));
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (uploaded?.url) setImages((current) => [uploaded, ...current]);
  }, [uploaded]);

  return (
    <>
      <TopBar title="Media" />
      <main className="space-y-8 p-5 md:ml-72 md:p-12">
        <ImageUpload value={uploaded} onChange={setUploaded} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image) => (
            <button key={image.url} onClick={() => navigator.clipboard.writeText(image.url).then(() => toast.success("URL copied"))} className="overflow-hidden rounded-lg border border-stone-200 bg-white text-left">
              <div className="relative h-44 w-full">
                <Image src={image.url} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
              <p className="truncate p-3 text-xs text-stone-500">{image.url}</p>
            </button>
          ))}
        </div>
      </main>
    </>
  );
}
