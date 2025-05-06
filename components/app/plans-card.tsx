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
import { useGetUser } from "@/hooks/tanstack/use-get-user";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { formatUsersName } from "@/lib/utils";
import { useEffect, useState } from "react";
// import { createPortalSession } from "@/lib/stripe";
import { User } from "@supabase/supabase-js";
import { useUserStore } from "@/lib/store/user-store";

const publishableKey: string | undefined =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export function PlansCard({ plan }: PlansCardProps) {
  const { userId, userRoleId } = useUserStore();
  const [billingPortalUrl, setBillingPortalUrl] = useState<string | null>(null);

  const newUserRoleId = userRoleId
    ? (`${userRoleId}` as "1" | "2" | "3")
    : undefined;

  const { data: user } = useGetUser();
  const usersName = user?.user_metadata
    ? formatUsersName(user.user_metadata)
    : undefined;
  const userEmail = user?.email;

  const { name, price, status, features } = plan;

  const premiumSubscriptionForm = useForm<PurchasePremiumFormType>({
    resolver: zodResolver(purchasePremiumFormSchema),
    defaultValues: {
      purchaseType: PURCHASE_TYPES.LANDLORD_PREMIUM.type,
      priceId: PRICING.landlord.premium.monthly.priceId,
      landlordPremiumPrice: PRICING.landlord.premium.monthly.amount,
      userId: user?.id,
      userEmail,
      usersName,
      userRoleId: newUserRoleId,
    },
  });

  const {
    formState: { isSubmitting: isSubmittingPremium },
  } = premiumSubscriptionForm;

  const switchToBasicForm = useForm();
  const {
    formState: { isSubmitting: isSwitchingToBasic },
  } = switchToBasicForm;

  async function handleSubscribeToPremium(values: PurchasePremiumFormType) {
    const { purchaseType, userId, priceId, landlordPremiumPrice, userRoleId } =
      values;

    try {
      const requestBody = {
        purchaseType,
        priceId,
        landlordPremiumPrice,
        userId,
        userEmail,
        usersName,
        userRoleId,
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

  // TODO: DRY this up in other places, maybe abstract into a file
  async function createPortalSession(
    userId: User["id"] | undefined,
  ): Promise<string> {
    const response = await fetch("/api/billing-portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(
        "There was an error creating the billing portal session.",
      );
    }

    const { url } = await response.json();
    return url;
  }
  // TODO: HANDLE CASE WHERE A USER IS NOT YET A CUSTOMER
  // Preload portal session on mount
  useEffect(() => {
    async function preloadBillingPortal() {
      if (!userId) return;

      try {
        const url = await createPortalSession(userId);
        setBillingPortalUrl(url);
      } catch (error: any) {
        console.error(error);
      }
    }

    preloadBillingPortal();
  }, [userId]);

  async function handleRedirect() {
    try {
      if (!userId) {
        throw new Error(
          "Some necessary details are missing. Please reload and try again later.",
        );
      }

      let url = billingPortalUrl;

      // If not preloaded, fetch on demand
      if (!url) {
        const portalUrl = await createPortalSession(userId);
        url = portalUrl;
        setBillingPortalUrl(url); // cache for future
      }

      window.location.href = url!;
    } catch (error: any) {
      if (error instanceof Error) {
        toast({
          variant: "default",
          description: error.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
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
              <form onSubmit={switchToBasicForm.handleSubmit(handleRedirect)}>
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
