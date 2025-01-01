import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

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
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />

          <div className="flex flex-col gap-1">
            <h4 className="mb-2 block">What type of user?</h4>

            <div className="flex gap-4">
              <label className="flex gap-2" htmlFor="option-landlord">
                <input
                  required
                  type="radio"
                  value="2"
                  id="option-landlord"
                  name="role_id"
                />
                Landlord
              </label>
              <label className="flex gap-2" htmlFor="option-tenant">
                <input
                  type="radio"
                  value="3"
                  id="option-tenant"
                  name="role_id"
                />
                Tenant
              </label>
            </div>
          </div>

          {/* <Label className="mb-2 block">What type of user?</Label>
          <RadioGroup defaultValue="3" className="space-y-2" name="role_id">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="option-landlord" />
              <Label htmlFor="option-landlord">Landlord</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="option-tenant" />
              <Label htmlFor="option-tenant">Tenant</Label>
            </div>
          </RadioGroup> */}

          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </>
  );
}
