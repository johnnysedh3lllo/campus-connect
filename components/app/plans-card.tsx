"use client";
import { CheckIcon } from "@/public/icons/check-icon";
import { Button } from "../ui/button";
import { PlansCardProps } from "@/lib/prop.types";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { PRICING, PURCHASE_TYPES } from "@/lib/pricing.config";

export function PlansCard({
  isPremium,
  plan,
  price,
  planFeatures,
}: PlansCardProps) {
  const { data: user } = useUser();

  async function handleClick() {
    if (!isPremium) return;

    const purchaseType = PURCHASE_TYPES.LANDLORD_PREMIUM.type;
    const priceId = PRICING.landlord.premium.monthly.priceId;
    const landlordPremiumPrice = PRICING.landlord.premium.monthly.amount;
    const userId = user?.id;

    try {
      const requestBody = {
        purchaseType,
        userId,
        priceId,
        landlordPremiumPrice,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log(response);
        const { sessionId } = await response.json();
        console.log(sessionId);
        //     const stripe = await loadStripe(
        //       process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
        //     );
        //     const stripeError = await stripe?.redirectToCheckout({
        //       sessionId,
        //     });
        //     if (stripeError?.error) {
        //       throw new Error(`Stripe error: ${stripeError.error}`);
        //     }
        //     return;
        //   } else {
        //     throw new Error(
        //       "There was an error trying to process checkout, please try again:",
        //     );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section
      className={`${isPremium ? "text-text-accent bg-background" : "bg-background-accent text-white"} border-line flex w-full flex-col gap-6 rounded-md border p-6`}
    >
      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-2 lg:gap-3">
          <h2 className="text-2xl leading-8 font-semibold">{plan}</h2>
          <p className="text-sm leading-6 font-medium">{price}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm leading-6">Includes:</h3>

          <ul className="flex flex-col gap-4">
            {planFeatures.map((feature, index) => {
              return (
                <li key={index} className="flex items-start gap-1">
                  <CheckIcon className="" />
                  <p className="text-sm leading-6 font-semibold">{feature}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <Button
        disabled={!isPremium}
        onClick={handleClick}
        className="h-full w-full px-11 py-3 text-base leading-6 disabled:opacity-100 sm:w-fit"
      >
        {isPremium ? "Switch to Basic" : "This is your current plan"}
      </Button>
    </section>
  );
}
