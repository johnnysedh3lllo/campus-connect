import { ALLOWED_ORIGINS } from "@/lib/config/app.config";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

const CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, x-supabase-auth, apikey",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400", // 24 hours
};

export function handleCors(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin");
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);

  return {
    ...CORS_HEADERS,
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "null",
  };
}

export function handlePreflightRequest(request: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: handleCors(request),
  });
}

export function createApiResponse(
  data: any,
  options: {
    status?: number;
    request: NextRequest;
    headers?: Record<string, string>;
  },
) {
  const { status = 200, request, headers = {} } = options;

  const corsHeaders = handleCors(request);

  return NextResponse.json(data, {
    status,
    headers: {
      ...corsHeaders,
      ...headers,
    },
  });
}

export function createApiErrorResponse(
  message: string,
  options: {
    status?: number;
    request: NextRequest;
    details?: any;
  },
) {
  const { status = 400, request, details } = options;

  return createApiResponse(
    {
      error: message,
      ...(details && { details }),
    },
    { status, request },
  );
}
