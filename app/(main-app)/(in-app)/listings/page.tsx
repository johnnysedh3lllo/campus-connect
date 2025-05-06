import { Metadata } from "next";
import ListingPageBody from "@/components/app/page-containers/listings-page-body";

export const metadata: Metadata = {
  title: "Listings",
};

export default async function Page() {
  return <ListingPageBody />;
}
