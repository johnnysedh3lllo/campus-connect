import { createClient } from "@/utils/supabase/server";
import { UserResponse } from "@supabase/supabase-js";
import { Metadata } from "next";

import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
    error: getUserError,
  }: UserResponse = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/sign-in");
  // }

  let { data: profile } = user?.id
    ? await supabase.from("users").select("*").eq("id", user.id).single()
    : { data: null };

  let { data: roles } = await supabase.from("roles").select("*").single();

  // let { data: properties } =
  //   user?.user_metadata.role_id === 2
  //     ? await supabase.from("properties").select("*").eq("landlord_id", user.id)
  //     : await supabase.from("properties").select("*");

  // console.log("from the roles table:", roles);
  // console.log("users table:", profile);

  return (
    <>
      <h1 className="font-bold">dashboard</h1>
      <div className="grid gap-2 p-4">
        <Link href="/dashboard/settings">settings</Link>
        <Link href="/dashboard/properties">properties</Link>
        <Link href="/dashboard/messages">messages</Link>
      </div>


      <div className="h-[50vh] border border-solid border-black overflow-y-auto">
        <div className="p-4 ">
          <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>
        <div className="p-4">
          <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>
        <div className="p-4">
          <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>
        <div className="p-4">
          <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>
        <div className="p-4">
          <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>
        <div className="p-4">
          <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>
        <div className="p-4">
          <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>
        <div className="p-4">
          <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>
        <div className="p-4">
          <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>
        <div className="p-4">
          <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>

        <div className="grid gap-8 p-4">
          {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
        </div>
      </div>
    </>
  );
}
