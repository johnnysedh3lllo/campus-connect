import { PackagesPageBody } from "@/components/app/page-containers/in-app/packages-page-body";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages",
};

export default function PackagesPage() {
  return <PackagesPageBody />;
}
