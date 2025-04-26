import { PremiumIllustration } from "@/public/illustrations/premiumIllustration";
import { Button } from "../ui/button";
import Link from "next/link";

export function PremiumBanner() {
  return (
    <div className="bg-primary flex flex-col gap-6 rounded-md p-4">
      <div className="flex items-start gap-3">
        <PremiumIllustration className="hidden size-20 sm:block" />

        <section className="text-text-inverse flex flex-col gap-2">
          <h2 className="text-2xl leading-8 font-semibold">
            Unlock Premium Benefits
          </h2>

          <p className="text-sm leading-6">
            Find the perfect tenants in any location you choose to list & get
            expert support from us!
          </p>
        </section>
      </div>

      <Link className="w-fit" href="/plans">
        <Button
          variant={"secondary"}
          className="h-full w-full px-6 py-3 text-base sm:w-fit"
        >
          Get Premium
        </Button>
      </Link>
    </div>
  );
}
