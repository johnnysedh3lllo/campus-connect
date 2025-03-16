import { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { UserResponse } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/public/icons/plus-icon";
import { Header } from "@/components/app/header";
import { EmptyPageState } from "@/components/app/empty-page-state";

import listingIllustration from "@/public/illustrations/illustration-listings.svg";

export const metadata: Metadata = {
  title: "Properties",
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


  return (
    <>
      <Header
        title="Listings"
        subTitle="Here are all the houses you have listed"
        buttonText="Create a listing"
        buttonIcon={<PlusIcon />}
        showButton={true}
      />
      <div className="flex items-center justify-center px-4 pt-4 pb-8">
        <EmptyPageState
          imageSrc={listingIllustration}
          title="You have no listings yet"
          subTitle="Kick start your journey with us by making your first listing. Clicking the button below"
          buttonText="Create a listing"
          buttonIcon={<PlusIcon />}
          showButton={true}
        />
      </div>
    </>
  );
}
