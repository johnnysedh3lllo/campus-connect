"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";

export function ProfilePlanDisplay({
  userActiveSubscription,
  userCurrentPlan,
}: {
  userActiveSubscription: Subscriptions | null | undefined;
  userCurrentPlan: "Premium" | "Basic";
}) {
  return (
    <header className="flex items-center justify-between">
      <section>
        <h2 className="text-2xl leading-6 font-semibold">Current plan</h2>

        {/* TODO: REFACTOR */}
        <p>{userCurrentPlan}</p>
      </section>

      {/* TODO: REFACTOR */}
      {!userActiveSubscription ? (
        <Link href="/plans">
          <Button
            variant={"outline"}
            className="h-full flex-1 cursor-pointer gap-3 text-base leading-6 sm:flex"
          >
            View plans
            <ChevronRightIcon />
          </Button>
        </Link>
      ) : (
        <Link href="/plans">
          <Button
            variant={"outline"}
            className="h-full cursor-pointer gap-3 text-base leading-6 sm:flex"
          >
            Manage Plans
            <ChevronRightIcon />
          </Button>
        </Link>
      )}
    </header>
  );
}
