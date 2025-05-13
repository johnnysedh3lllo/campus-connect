import { Metadata } from "next";
import ListingPageBody from "@/components/app/page-containers/in-app/listings-page-body";

export const metadata: Metadata = {
  title: "Listings",
};

export default async function Page() {
  return <ListingPageBody />;
}
