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
  // const paths: string[] = [
  //   "/listings",
  //   "/profile",
  //   "messages",
  //   "/settings",
  //   "/plans",
  //   "/buy-credits",
  // ];

  if (request.nextUrl.pathname.startsWith("/") && user.error) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/listings") && user.error) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/profile") && user.error) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/messages") && user.error) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/settings") && user.error) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/plans") && user.error) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/buy-credits") && user.error) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }

  // redirects when user is logged in
  if (request.nextUrl.pathname === "/log-in" && !user.error) {
    return NextResponse.redirect(new URL("/listings", request.url));
  }

  if (request.nextUrl.pathname === "/sign-up" && !user.error) {
    return NextResponse.redirect(new URL("/listings", request.url));
  }

  return response;
};

export const config = {
  matcher: ["/log-in", "/listings"],
};
