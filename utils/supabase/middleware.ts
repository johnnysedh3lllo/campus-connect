import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser();

  // ROUTE PROTECTION
  const protectedPaths: string[] = [
    "/listings",
    "/profile",
    "/messages",
    "/settings",
    "/plans",
    "/buy-credits",
  ];
  const unProtectedPaths: string[] = ["/log-in", "/sign-up"];

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  const isUnprotected = unProtectedPaths.some(
    (path) => request.nextUrl.pathname === path,
  );

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }

  // TODO: handle this edge case, currently this redirects when the user looses connection
  if (isProtected && user.error) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }

  // redirects when user is logged in
  if (isUnprotected && !user.error) {
    return NextResponse.redirect(new URL("/listings", request.url));
  }

  return response;
};

export const config = {
  matcher: [
    // "/",
    "/log-in",
    "/sign-up",
    "/listings/:path*",
    "/profile/:path*",
    "/messages/:path*",
    "/settings/:path*",
    "/plans/:path*",
    "/buy-credits/:path*",
  ],
};
