import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public pages
        if (req.nextUrl.pathname.startsWith('/api/auth') ||
            req.nextUrl.pathname.startsWith('/api/health') ||
            req.nextUrl.pathname.startsWith('/_next') ||
            req.nextUrl.pathname.startsWith('/static') ||
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/companies') ||
            req.nextUrl.pathname.startsWith('/listings') ||
            req.nextUrl.pathname.startsWith('/list')) {
          return true;
        }
        
        // Require authentication for protected routes
        if (req.nextUrl.pathname.startsWith('/my-listings') ||
            req.nextUrl.pathname.startsWith('/saved') ||
            req.nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - api/health (health check)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|api/health|_next/static|_next/image|favicon.ico).*)",
  ],
};
