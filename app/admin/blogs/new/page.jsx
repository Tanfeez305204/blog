import TopBar from "@/components/admin/TopBar";
import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <>
      <TopBar title="New Post" />
      <main className="p-5 md:ml-72 md:p-12">
        <BlogForm />
      </main>
    </>
  );
}
