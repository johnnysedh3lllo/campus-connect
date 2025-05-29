import SelectRolePage from "@/components/app/page-containers/auth/select-role-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select Role",
};

export default async function Page() {
  return <SelectRolePage />;
}
