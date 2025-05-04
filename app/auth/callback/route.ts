import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    
    // Make sure we have a session before redirecting
    if (!data.session) {
      console.error("Failed to create session", error);
      // Redirect to a proper error page
      return NextResponse.redirect(`${origin}/reset-password?error=auth`);
    }
  }

  // Add a short delay to ensure cookies are set before redirecting
  // This can help with session persistence
  await new Promise(resolve => setTimeout(resolve, 100));

  if (redirectTo) {
    // Use a 302 redirect to ensure proper handling of cookies
    return NextResponse.redirect(`${origin}${redirectTo}`, { status: 302 });
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}`, { status: 302 });
}
