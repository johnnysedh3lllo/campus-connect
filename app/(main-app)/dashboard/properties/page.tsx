import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Properties",
};

export default async function Page() {
  return (
    <>
      <h1 className="font-bold">Properties</h1>
      <Link href="/dashboard">dashboard</Link>
    </>
  );
}
