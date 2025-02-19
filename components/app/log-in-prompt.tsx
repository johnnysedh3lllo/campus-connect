"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type LoginPromptProps = {
  callToAction: string;
  route: string;
};

export function LoginPrompt({ callToAction, route }: LoginPromptProps) {
  return (
    <p className="text-center text-sm">
      {callToAction}{" "}
      <Button className="text-primary p-1 font-medium" variant={"link"}>
        <Link href={route}>Log in</Link>
      </Button>
    </p>
  );
}
