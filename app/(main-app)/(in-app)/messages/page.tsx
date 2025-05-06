import MessagesPageBody from "@/components/app/page-containers/messages-page-body";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function MessagesPage() {
  return <MessagesPageBody />;
}
