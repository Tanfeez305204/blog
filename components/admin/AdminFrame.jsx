"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminFrame({ children }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return children;
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}
