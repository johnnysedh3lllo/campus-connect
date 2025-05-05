import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";

type UserTierSummaryProps = {
  tier: string;
  currentTier: string;
  buttonText: string;
  href: string;
};

export default function UserTierSummary({
  tier,
  currentTier,
  buttonText,
  href,
}: UserTierSummaryProps) {
  return (
    <header className="flex items-center justify-between">
      <section>
        <h2 className="text-2xl leading-6 font-semibold capitalize">
          Current {tier}
        </h2>

        <p>{currentTier}</p>
      </section>

      <Link href={href}>
        <Button
          variant={"outline"}
          className="h-full flex-1 cursor-pointer gap-3 text-base leading-6 capitalize sm:flex"
        >
          View {buttonText}
          <ChevronRightIcon />
        </Button>
      </Link>
    </header>
  );
}
