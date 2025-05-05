import { CreditChipIcon } from "@/public/icons/credit-chip-icon";
import { useGetUserCredits } from "@/hooks/tanstack/use-get-user-credits";
import { useGetActiveSubscription } from "@/hooks/tanstack/use-get-active-subscription";
import BuyCredits from "./buy-credits";
import { CreditDisplayCardSkeleton } from "./skeletons/credit-display-card-skeleton";
import { useUserStore } from "@/lib/store/user-store";

export function CreditDisplayCard() {
  const { userId, userRoleId } = useUserStore();

  const { data: creditRecord } = useGetUserCredits(
    userId || undefined,
    userRoleId,
  );
  const { data: userActiveSubscription } = useGetActiveSubscription(
    userId || undefined,
    userRoleId,
  );

  const hasActiveSubscription = !!userActiveSubscription;
  const creditAmount = creditRecord?.remaining_credits || 0;

  return creditAmount || creditAmount === 0 ? (
    <div className="border-border flex flex-col gap-6 rounded-md border-1 p-4">
      <div className="flex items-start gap-3">
        {/* CREDIT BALANCE */}
        <CreditChipIcon className="size-11" />

        <section className="flex flex-col gap-2">
          <h2 className="flex text-2xl leading-8 font-semibold">
            Credits: {creditAmount}
          </h2>

          <p className="text-sm leading-6">
            Get credits to boost listings and connect with tenants!
          </p>
        </section>
      </div>

      {/* TODO: REFACTOR */}
      <BuyCredits disabled={hasActiveSubscription} />
    </div>
  ) : (
    <CreditDisplayCardSkeleton />
  );
}
