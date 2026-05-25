"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) router.push("/admin/dashboard");
    else toast.error("Invalid admin credentials");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-5">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-8">
        <h1 className="font-heading text-4xl font-bold">Qalam Admin</h1>
        <p className="mt-2 text-stone-600">Sign in to manage the studio.</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="mt-8 w-full rounded border border-stone-300 p-3" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="mt-3 w-full rounded border border-stone-300 p-3" />
        <button className="mt-5 w-full rounded-lg bg-accent px-5 py-3 font-bold text-white">Sign In</button>
      </form>
    </main>
  );
}
