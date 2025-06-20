import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/authUtils";
import { AUTH_COOKIE_NAME } from "./constants";

const publicPaths = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // Allow access to public paths without token
  if (publicPaths.includes(pathname)) {
    // If user has valid token and tries to access sign-in/sign-up, redirect to home
    if (token) {
      try {
        await verifyToken(token);
        return NextResponse.redirect(new URL("/", request.url));
      } catch {
        // If token is invalid, allow access to public paths
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // For protected routes, check token
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    // Verify token but don't redirect on success - let the layout handle admin checks
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    // If token is invalid, redirect to sign-in
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|avatars|images|fonts|public).*)",
  ],
};
