import AdminFrame from "@/components/admin/AdminFrame";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-cream">
      <AdminFrame>{children}</AdminFrame>
    </div>
  );
}
