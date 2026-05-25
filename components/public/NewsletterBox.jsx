"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");

  async function submit(e) {
    e.preventDefault();
    const res = await fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (res.ok) {
      toast.success("Subscribed");
      setEmail("");
    } else {
      toast.error("Could not subscribe");
    }
  }

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <h2 className="font-heading text-4xl font-bold">Get the daily note</h2>
        <form onSubmit={submit} className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" className="min-h-12 flex-1 rounded-lg border border-white/20 bg-white px-4 text-ink" />
          <button className="rounded-lg bg-accent px-6 py-3 font-bold text-white">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
