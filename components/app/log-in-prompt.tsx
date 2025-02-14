"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LoginPrompt() {
  return (
    <p className="text-center text-sm">
      Already have an account?{" "}
      <Button className="text-primary p-1 font-medium" variant={"link"}>
        <Link href="/log-in">Log in</Link>
      </Button>
    </p>
  );
}
