import { notFound } from "next/navigation";
import TopBar from "@/components/admin/TopBar";
import BlogForm from "@/components/admin/BlogForm";
import { getBlogByIdOrSlug } from "@/lib/blog-data";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }) {
  const blog = await getBlogByIdOrSlug(params.id);
  if (!blog) notFound();
  return (
    <>
      <TopBar title="Edit Post" />
      <main className="p-5 md:ml-72 md:p-12">
        <BlogForm initial={blog} />
      </main>
    </>
  );
}
