import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { UserResponse } from "@supabase/supabase-js";
import { userRoles, UserRoles } from "@/lib/testData";

interface UserMetadata {
  first_name: string;
  last_name: string;
  role_id: keyof UserRoles; // Only allows 1, 2, or 3
}

export default async function AuthButton(): Promise<JSX.Element> {
  const supabase = await createClient();

  const {
    data: { user },
  }: UserResponse = await supabase.auth.getUser();

  const userMetaData = user?.user_metadata as UserMetadata;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        Hey, {userMetaData.first_name}!<p>{userRoles[userMetaData?.role_id]}</p>
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <form action={signOutAction}>
          <Button type="submit" variant={"outline"}>
            Sign out
          </Button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }
}
