"use client";
import { CheckIcon } from "@/public/icons/check-icon";
import { Button } from "../ui/button";
import { PlansCardProps } from "@/lib/prop.types";

import { loadStripe } from "@stripe/stripe-js";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { PurchasePremiumFormType } from "@/lib/form.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchasePremiumFormSchema } from "@/lib/form.schemas";
import { PRICING, PURCHASE_TYPES } from "@/lib/pricing.config";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import Link from "next/link";
import { formatUsersName } from "@/lib/utils";

const publishableKey: string | undefined =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export function PlansCard({ name, price, status, features }: PlansCardProps) {
  const { data: user } = useUser();

  const premiumSubscriptionForm = useForm<PurchasePremiumFormType>({
    resolver: zodResolver(purchasePremiumFormSchema),
    defaultValues: {
      purchaseType: PURCHASE_TYPES.LANDLORD_PREMIUM.type,
      priceId: PRICING.landlord.premium.monthly.priceId,
      landlordPremiumPrice: PRICING.landlord.premium.monthly.amount,
      userId: user?.id,
    },
  });

  const switchToBasicForm = useForm();

  const {
    formState: { isSubmitting: isSubmittingPremium },
  } = premiumSubscriptionForm;

  const {
    formState: { isSubmitting: isSwitchingToBasic },
  } = switchToBasicForm;

  async function handleSubscribeToPremium(values: PurchasePremiumFormType) {
    const { purchaseType, userId, priceId, landlordPremiumPrice } = values;
    const usersName = user?.user_metadata
      ? formatUsersName(user.user_metadata)
      : undefined;
    const userEmail = user?.email;

    try {
      const requestBody = {
        purchaseType,
        priceId,
        landlordPremiumPrice,
        userId,
        userEmail,
        usersName,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const { sessionId } = await response.json();

        if (!publishableKey) {
          throw new Error("Stripe publishable key not found");
        }
        const stripe = await loadStripe(publishableKey);

        const stripeError = await stripe?.redirectToCheckout({
          sessionId,
        });

        if (stripeError?.error) {
          throw new Error(`Stripe error: ${stripeError.error}`);
        }
      } else {
        const responseObj: { error: string } = await response.json();
        toast({
          variant: "default",
          // title: "Please confirm email and password",
          description: responseObj.error,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });

        throw responseObj;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSwitchToBasic() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("opening Stripe billing portal to switch to basic basic");
  }

  return (
    <section
      className={`${status ? "bg-background-accent text-white" : "text-text-accent bg-background"} border-line flex w-full flex-col gap-6 rounded-md border p-6`}
    >
      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-2 lg:gap-3">
          <h2 className="text-2xl leading-8 font-semibold capitalize">
            {name}
          </h2>
          <p className="text-sm leading-6 font-medium capitalize">{price}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm leading-6">Includes:</h3>

          <ul className="flex flex-col gap-4">
            {features.map((feature, index) => {
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

      {status ? (
        <span className="bg-primary text-text-inverse w-fit rounded-sm px-11 py-3 text-base leading-6 font-semibold">
          This is your current plan
        </span>
      ) : (
        <>
          {name === "basic" ? (
            <Form {...switchToBasicForm}>
              <form
                onSubmit={switchToBasicForm.handleSubmit(handleSwitchToBasic)}
              >
                <Button
                  type="submit"
                  disabled={isSwitchingToBasic}
                  className="h-full w-full px-11 py-3 text-base leading-6 sm:w-fit"
                >
                  {isSwitchingToBasic && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {isSwitchingToBasic ? "Processing..." : "Switch to Basic"}
                </Button>
              </form>
            </Form>
          ) : name === "premium" ? (
            <Form {...premiumSubscriptionForm}>
              <form
                onSubmit={premiumSubscriptionForm.handleSubmit(
                  handleSubscribeToPremium,
                )}
              >
                <Button
                  type="submit"
                  disabled={isSubmittingPremium}
                  className="h-full w-full px-11 py-3 text-base leading-6 sm:w-fit"
                >
                  {isSubmittingPremium && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {isSubmittingPremium ? "Processing..." : "Go Premium"}
                </Button>
              </form>
            </Form>
          ) : null}
        </>
      )}
    </section>
  );
}
