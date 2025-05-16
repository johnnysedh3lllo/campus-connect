import { ROLES } from "@/lib/app.config";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse, URLPattern } from "next/server";

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
  const userRoleId = +user?.data?.user?.user_metadata.role_id;

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

  const landlordAllowedPaths: string[] = ["/listings/create", "/listing/edit/"];

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
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // handle role-specific routes for authenticated users
  if (request.nextUrl.pathname === "/packages") {
    if (user.error) {
      return NextResponse.redirect(new URL("/log-in", request.url));
    }

    if (userRoleId === ROLES.LANDLORD) {
      return NextResponse.redirect(new URL("/plans", request.url));
    }
  }

  const landlordAllowedRegex = /^\/listings\/(create|edit(\/[^\/]*)?)$/;
  if (landlordAllowedRegex.test(request.nextUrl.pathname)) {
    if (user.error) {
      return NextResponse.redirect(new URL("/log-in", request.url));
    }

    if (userRoleId === ROLES.TENANT) {
      return NextResponse.redirect(new URL("/listings", request.url));
    }
  }

  // const tenantAllowedRegex: RegExp = /^\/listings\/[^\/]+\/[^\/]+$/;
  // if (tenantAllowedRegex.test(request.nextUrl.pathname)) {
  //   if (user.error) {
  //     return NextResponse.redirect(new URL("/log-in", request.url));
  //   }

  //   if (userRoleId === ROLES.LANDLORD) {
  //     // Strip off landlordId from the end and redirect
  //     const pathParts = request.nextUrl.pathname.split("/");
  //     const newPath = `/listings/${pathParts[2]}`;
  //     return NextResponse.redirect(new URL(newPath, request.url));
  //   }
  // }

  if (request.nextUrl.pathname === "/plans") {
    if (user.error) {
      return NextResponse.redirect(new URL("/log-in", request.url));
    }

    if (userRoleId === ROLES.TENANT) {
      return NextResponse.redirect(new URL("/packages", request.url));
    }
  }

  return response;
};

export const config = {
  matcher: [
    "/",
    "/log-in",
    "/sign-up",
    "/listings/:path*",
    "/profile/:path*",
    "/messages/:path*",
    "/settings/:path*",
    "/plans/:path*",
    "/packages/:path*",
    "/buy-credits/:path*",
  ],
};
