import { useUserCredits } from "@/hooks/use-user-credits";
import { CreditBalanceProps } from "@/lib/prop.types";
import { CreditChipIcon } from "@/public/icons/credit-chip-icon";

export function CreditBalance({
  userId,
  increment,
  className = "flex items-center gap-2",
}: CreditBalanceProps) {
  const { data: creditAmount } = useUserCredits(userId);

  const credits = creditAmount?.remaining_credits || 0;

  return (
    <div className={`${className}`}>
      <CreditChipIcon />
      <p className="text-sm leading-6 font-medium">
        {increment ? credits + increment : credits} Credits
      </p>
    </div>
  );
}
