import Link from "next/link";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  return (
    <>
      <h1 className="font-bold">dashboard</h1>
      <Link href="/dashboard/settings">settings</Link>
      <Link href="/dashboard/properties">properties</Link>
    </>
  );
}
