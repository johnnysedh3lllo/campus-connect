"use client";
import { useUserCredits } from "@/hooks/use-user-credits";
import { CreditBalanceProps } from "@/lib/prop.types";
import { CreditChipIcon } from "@/public/icons/credit-chip-icon";

export function CreditBalance({
  userId,
  increment,
  className = "flex items-center gap-2",
}: CreditBalanceProps) {
  const { data: creditRecord } = useUserCredits(userId);

  const creditAmount = creditRecord?.remaining_credits || 0;

  return (
    <div className={`${className}`}>
      <CreditChipIcon />
      <p className="text-sm leading-6 font-medium">
        {increment ? creditAmount + increment : creditAmount} Credits
      </p>
    </div>
  );
}
