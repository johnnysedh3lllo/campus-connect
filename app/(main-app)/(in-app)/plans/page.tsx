import PlansPageBody from "@/components/app/page-containers/plans-page-body";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans",
};

export default function PlansPage() {
  return <PlansPageBody />;
}
