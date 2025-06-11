import { redirectRoutes, ROLES, SITE_CONFIG } from "@/lib/config/app.config";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { handleCors, handlePreflightRequest } from "@/lib/api/response";

export const updateSession = async (request: NextRequest) => {
  // Handle CORS preflight requests for API routes
  if (
    request.method === "OPTIONS" &&
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return handlePreflightRequest(request);
  }

  // Block requests with invalid or missing origins
  const origin = request.headers.get("origin");
  const requestId = request.headers.get("x-request-id") ?? "no-id";

  const isStripeWebhook = request.nextUrl.pathname === "/api/webhook";

  if (
    request.nextUrl.pathname.startsWith("/api/") &&
    !isStripeWebhook &&
    (!origin || !SITE_CONFIG.ALLOWED_ORIGINS.includes(origin))
  ) {
    console.error(`[${requestId}]: Invalid or missing origin: ${origin}`);

    const res = NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 },
    );

    const corsHeaders = handleCors(request);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.headers.set(key, value);
    });

    return res;
  }

  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Add CORS headers to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const corsHeaders = handleCors(request);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

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

          // Re-apply CORS headers after response modification
          if (request.nextUrl.pathname.startsWith("/api/")) {
            const corsHeaders = handleCors(request);
            Object.entries(corsHeaders).forEach(([key, value]) => {
              response.headers.set(key, value);
            });
          }
        },
      },
    },
  );

  // Skip auth checks for API routes (handle in individual route handlers)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return response;
  }

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
    "/packages",
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
  if (isProtected) {
    if (user.error) {
      return NextResponse.redirect(new URL("/log-in", request.url));
    }
    if (!userRoleId) {
      return NextResponse.redirect(
        new URL(redirectRoutes.usersWithoutARole, request.url),
      );
    }
  }

  // redirects when user is logged in
  if (isUnprotected && !user.error && userRoleId) {
    return NextResponse.redirect(new URL("/listings", request.url));
  }

  // semi-protected
  if (
    request.nextUrl.pathname === redirectRoutes.usersWithoutARole &&
    user.error
  ) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }

  // handle role-specific routes for authenticated users
  if (
    request.nextUrl.pathname === "/packages" &&
    userRoleId === ROLES.LANDLORD
  ) {
    return NextResponse.redirect(new URL("/plans", request.url));
  }

  const landlordAllowedRegex = /^\/listings\/(create|edit(\/[^\/]*)?)$/;
  if (
    landlordAllowedRegex.test(request.nextUrl.pathname) &&
    userRoleId === ROLES.TENANT
  ) {
    return NextResponse.redirect(new URL("/listings", request.url));
  }

  if (request.nextUrl.pathname === "/plans" && userRoleId === ROLES.TENANT) {
    return NextResponse.redirect(new URL("/packages", request.url));
  }

  return response;
};

export const config = {
  matcher: [
    "/",
    "/log-in",
    "/sign-up",
    "/select-role",
    "/listings/:path*",
    "/profile/:path*",
    "/messages/:path*",
    "/settings/:path*",
    "/plans/:path*",
    "/packages/:path*",
    "/buy-credits/:path*",
    "/api/:path*",
  ],
};
