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
import { useState } from "react";
import { PRICING, PURCHASE_TYPES } from "@/lib/pricing.config";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

export function PlansCard({ name, price, status, features }: PlansCardProps) {
  const { data: user } = useUser();

  const otherPlan = `Switch to ${status ? "Premium" : "Basic"}`;

  const premiumSubscriptionForm = useForm<PurchasePremiumFormType>({
    resolver: zodResolver(purchasePremiumFormSchema),
    defaultValues: {
      purchaseType: PURCHASE_TYPES.LANDLORD_PREMIUM.type,
      priceId: PRICING.landlord.premium.monthly.priceId,
      landlordPremiumPrice: PRICING.landlord.premium.monthly.amount,
      userId: user?.id,
    },
  });

  // const returnToBasicFrom = useForm

  const {
    formState: { isSubmitting: isSubmittingPremium },
  } = premiumSubscriptionForm;

  async function handlePremiumSubscription(values: PurchasePremiumFormType) {
    const { purchaseType, userId, priceId, landlordPremiumPrice } = values;
    console.log(values);

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
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
        );
        const stripeError = await stripe?.redirectToCheckout({
          sessionId,
        });
        if (stripeError?.error) {
          throw new Error(`Stripe error: ${stripeError.error}`);
        }
        return;
      } else {
        throw new Error(
          "There was an error trying to process checkout, please try again:",
        );
      }
    } catch (error) {
      console.error(error);
    }
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
          <p className="text-sm leading-6 font-medium">{price}</p>
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
            <Button className="h-full w-full px-11 py-3 text-base leading-6 disabled:opacity-100 sm:w-fit">
              Switch to Basic
            </Button>
          ) : name === "premium" ? (
            <Form {...premiumSubscriptionForm}>
              <form
                onSubmit={premiumSubscriptionForm.handleSubmit(
                  handlePremiumSubscription,
                )}
              >
                <Button
                  disabled={isSubmittingPremium}
                  className="h-full w-full px-11 py-3 text-base leading-6 disabled:opacity-100 sm:w-fit"
                >
                  {isSubmittingPremium ? "Processing..." : "Go Premium"}
                  {isSubmittingPremium && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </Button>
              </form>
            </Form>
          ) : null}
        </>
      )}
    </section>
  );
}
