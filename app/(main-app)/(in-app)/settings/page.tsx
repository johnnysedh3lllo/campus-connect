import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Page() {
  return (
    <>
      <h1 className="font-bold">settings</h1>
      <Link href="/listings">Listings</Link>
    </>
  );
}
