import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";

type UserTierSummaryProps = {
  tier: string;
  currentTier: string;
  buttonText: string;
  href: string;
  inquiriesCount?: number | null | undefined;
};

export default function UserTierSummary({
  tier,
  currentTier,
  buttonText,
  href,
  inquiriesCount,
}: UserTierSummaryProps) {
  return (
    <header className="flex flex-col items-start justify-between gap-4 sm:flex-row">
      <section>
        <h2 className="text-2xl leading-6 font-semibold capitalize">
          Current {tier}
        </h2>

        <p className="capitalize">{currentTier}</p>

        {inquiriesCount && (
          <p className="text-text-secondary text-sm leading-6">
            {inquiriesCount} Inquiries remaining
          </p>
        )}
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
