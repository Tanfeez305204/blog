import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Skip middleware for next/static, API and common static asset requests
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/static") ||
      pathname.startsWith("/favicon.ico") ||
      pathname.startsWith("/robots.txt") ||
      pathname.includes(".") // files with extensions (fonts, images, css, etc)
    ) {
      return NextResponse.next();
    }

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
