import { updateUser } from "@/app/actions/supabase/user";
import { redirectRoutes } from "@/lib/config/app.config";
import { OAuthActionType } from "@/types/config.types";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // This route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs

  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  let redirect_to = requestUrl.searchParams.get("redirect_to") ?? "/";

  let userRoleId = Number(requestUrl?.searchParams?.get("userRoleId"));
  let currentAction = requestUrl?.searchParams?.get(
    "action",
  ) as OAuthActionType;

  if (!redirect_to.startsWith("/")) {
    redirect_to = "/";
  }

  if (code) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";

      const user = data?.user;
      const userMetadata = user.user_metadata;
      const fullName = ((userMetadata?.full_name as string) || "").trim();
      const [firstName, ...rest] = fullName.split(/\s+/);
      const lastName = rest.join(" ");

      switch (currentAction) {
        case "signup":
          console.info("the user is signing in");
          // update user
          const { error: updateUserError } = await updateUser({
            data: {
              ...userMetadata,
              first_name: firstName,
              last_name: lastName,
              role_id: userRoleId,
            },
          });

          if (updateUserError) {
            console.error(updateUserError);
            return NextResponse.redirect(`${origin}/error`);
          }

          break;
        case "login":
          if (!userMetadata.role_id) {
            const { error: updateUserError } = await updateUser({
              data: {
                ...userMetadata,
                first_name: firstName,
                last_name: lastName,
              },
            });

            if (updateUserError) {
              console.error(updateUserError);
              return NextResponse.redirect(`${origin}/error`);
            }

            // since the user doesn't have a role_id they should be redirect to select a role
            return NextResponse.redirect(
              `${origin}${redirectRoutes.usersWithoutARole}`,
            );
          } else {
            console.info("the user is logging in");
          }

          break;
        default:
          break;
      }

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${redirect_to}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirect_to}`);
      } else {
        return NextResponse.redirect(`${origin}${redirect_to}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/error`);
}
