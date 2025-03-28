"use client";

import { useRouter } from "next/navigation";
import { PlusIcon } from "@/public/icons/plus-icon";
import { Header } from "@/components/app/header";
import { EmptyPageState } from "@/components/app/empty-page-state";

import listingIllustration from "@/public/illustrations/illustration-listings.svg";

export default async function Page() {
  const router = useRouter();


  // let { data: properties } =
  //   user?.user_metadata.role_id === 2
  //     ? await supabase.from("properties").select("*").eq("landlord_id", user.id)
  //     : await supabase.from("properties").select("*");
  function EmptyButtonAction() {
    router.push("/listings/create");
  }

  return (
    <>
      <Header
        title="Listings"
        subTitle="Here are all the houses you have listed"
        buttonText="Create a listing"
        buttonIcon={<PlusIcon />}
        showButton={true}
        onButtonClick={EmptyButtonAction}
      />
      <div className="flex items-center justify-center px-4 pt-4 pb-8">
        <EmptyPageState
          imageSrc={listingIllustration}
          title="You have no listings yet"
          subTitle="Kick start your journey with us by making your first listing. Clicking the button below"
          buttonText="Create a listing"
          buttonIcon={<PlusIcon />}
          showButton={true}
          onButtonClick={EmptyButtonAction}
        />
      </div>
    </>
  );
}
