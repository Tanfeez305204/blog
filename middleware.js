import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes - require admin role
    if (pathname.startsWith("/admin") && !pathname.includes("/login")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    pages: { signIn: "/admin/login" },
    callbacks: {
      authorized: ({ token }) => {
        return !!token; // Just check if token exists, role checks in middleware
      }
    }
  }
);

export const config = {
  matcher: ["/admin/((?!login).*)"]
};
