import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/authUtils";

const publicPaths = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  const { pathname } = request.nextUrl;

  if (publicPaths.includes(pathname)) {
    if (token) {
      try {
        await verifyToken(token);
        return NextResponse.redirect(new URL("/", request.url));
      } catch (error) {
        console.log("Token verification failed", error);
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|avatars|images|fonts|public).*)",
  ],
};
