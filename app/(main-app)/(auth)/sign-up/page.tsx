import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";

import { SelectRole } from "./form-steps";
import { Metadata } from "next";

// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

export const metadata: Metadata = {
  // metadataBase: new URL(defaultUrl),
  title: "Sign Up | Campus Connect",
  // description: "Your rental paradise",
};

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-6 pr-4 pb-6 pl-4 sm:p-16 lg:w-full">
      <div>1/4</div>

      <SelectRole />
      {/* forms */}
      {/* forms */}
    </div>
  );
}
