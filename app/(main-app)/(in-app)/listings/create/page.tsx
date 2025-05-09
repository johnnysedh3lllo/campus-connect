"use client";

import { Header } from "@/components/app/header";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";

export default function CreateListingPage() {
  return (
    <section>
      <Header
        title="New Listings"
        subTitle="Enter any necessary information"
        button={<CloseIconNoBorders className="size-10" />}
      />
    </section>
  );
}
