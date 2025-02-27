import { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { UserResponse } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/public/icons/plus-icon";

export const metadata: Metadata = {
  title: "Properties",
};

export default async function Page() {
  // const searchParams = useSearchParams();

  // console.log(await params);

  // console.log(searchParams.get("welcome"));

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
      <header className="max-w-screen-max-xl border-border mx-auto flex items-center justify-between border-b-1 p-4 pt-6 sm:px-12 sm:pt-10">
        <section>
          <h1 className="text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
            Listings
          </h1>
          <p className="text-text-secondary text-sm leading-6">
            Here are all the houses you have listed
          </p>
        </section>

        <Button className="hidden h-full gap-3 px-7.5 py-3 text-base leading-6 sm:flex [&_svg]:size-6">
          <p>Create a listing </p>
          <PlusIcon />
        </Button>
      </header>

      <div></div>
    </>
  );
}
