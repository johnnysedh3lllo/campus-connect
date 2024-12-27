import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

import { Metadata } from "next";
import { UserResponse } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
    error: getUserError,
  }: UserResponse = await supabase.auth.getUser();

  let { data: profiles } = user?.id
    ? await supabase.from("profiles").select("*").eq("id", user.id)
    : { data: null };
  let { data: roles } = await supabase.from("roles").select("*").single();

  // let { data: properties } =
  //   user?.user_metadata.role_id === 2
  //     ? await supabase.from("properties").select("*").eq("landlord_id", user.id)
  //     : await supabase.from("properties").select("*");

  console.log("from the roles table:", roles);
  console.log("profiles table:", profiles);

  const convertJSONToString = (jsonObj: {}) => JSON.stringify(jsonObj);

  return (
    <>
      <h1 className="font-bold">dashboard</h1>
      <Link href="/dashboard/settings">settings</Link>
      <Link href="/dashboard/properties">properties</Link>

      <div className="p-4">
        <p>{JSON.stringify(roles)}</p>
      </div>

      <div className="grid gap-8 p-4">
        {profiles &&
          profiles.map((profile) => {
            return <p key={profile.id}>{convertJSONToString(profile)}</p>;
          })}
      </div>
    </>
  );
}
