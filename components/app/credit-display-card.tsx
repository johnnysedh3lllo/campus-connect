import { CreditChipIcon } from "@/public/icons/credit-chip-icon";
import { Button } from "../ui/button";
import Link from "next/link";

export function CreditDisplayCard() {
  return (
    <div className="border-border flex flex-col gap-6 rounded-md border-1 p-4">
      <div className="flex items-start gap-3">
        {/* CREDIT BALANCE */}
        <CreditChipIcon className="size-11" />

        <section className="flex flex-col gap-2">
          <h2 className="text-2xl leading-8 font-semibold">Credits: 800</h2>

          <p className="text-sm leading-6">
            Get credits to boost listings and connect with tenants!
          </p>
        </section>
      </div>

      <Link className="w-fit" href="/buy-credits">
        <Button className="h-full w-full px-6 py-3 text-base sm:w-fit">
          Buy Credits
        </Button>
      </Link>
    </div>
  );
}
