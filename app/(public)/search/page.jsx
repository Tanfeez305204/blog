import SearchClient from "./search-client";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { listCategories } from "@/lib/blog-data";

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: "Search | Qalam Blog Studio",
    alternates: { canonical: `${siteUrl}/search` }
  };
}

export default async function SearchPage() {
  let categories = [];
  try {
    categories = await listCategories();
  } catch {}
  return (
    <>
      <Navbar categories={categories} />
      <SearchClient />
      <Footer />
    </>
  );
}
