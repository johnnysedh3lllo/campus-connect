import { PremiumIllustration } from "@/public/illustrations/premiumIllustration";
import premiumCardPattern from "@/public/patterns/pattern-premium-card.svg";
import Image from "next/image";

import { Button } from "../ui/button";
import Link from "next/link";

export type PremiumBannerProps = {
  title?: string;
  description: string;
  buttonText: string;
  href: string;
};

export function PremiumBanner({
  title = "Unlock Premium Benefits",
  description,
  buttonText,
  href,
}: PremiumBannerProps) {
  return (
    <div className="bg-primary relative overflow-hidden rounded-md p-4">
      <Image
        className="absolute inset-0 object-cover"
        alt="premium card pattern"
        fill={true}
        src={premiumCardPattern}
        quality={80}
      />

      <section className="relative flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <PremiumIllustration className="hidden size-20 sm:block" />
          <section className="text-text-inverse flex flex-col gap-2">
            <h2 className="text-2xl leading-8 font-semibold">{title}</h2>
            <p className="text-sm leading-6">{description}</p>
          </section>
        </div>
        <Link className="w-full sm:w-fit" href={href}>
          <Button
            variant={"secondary"}
            className="h-full w-full px-6 py-3 text-base sm:w-fit"
          >
            {buttonText}
          </Button>
        </Link>
      </section>
    </div>
  );
}
