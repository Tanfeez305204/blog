"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";

export default function ImageUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  async function upload(file) {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      onChange(data);
      toast.success("Image uploaded");
    } else {
      toast.error(data.message || "Upload failed");
    }
  }

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        upload(e.dataTransfer.files[0]);
      }}
      onDragOver={(e) => e.preventDefault()}
      className="cursor-pointer rounded-lg border border-dashed border-stone-300 bg-white p-5 text-center"
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files[0])} />
      {value?.url ? (
        <img src={value.url} alt="" className="mx-auto h-36 w-full rounded object-cover" />
      ) : (
        <div className="grid place-items-center gap-2 py-8 text-stone-500">
          <UploadCloud />
          <span>{loading ? "Uploading..." : "Drop image or click to upload"}</span>
        </div>
      )}
    </div>
  );
}
