"use client";
import Image, { StaticImageData } from "next/image";
import { Button } from "../ui/button";
import { CheckFillIcon } from "@/public/icons/check-fill-icon";
import { LoaderIcon } from "@/public/icons/loader-icon";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "@/lib/hooks/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import {
  createIdempotencyKey,
  formatCurrencyToLocale,
} from "@/lib/utils/app/utils";
import { PurchasePackageFormType, RoleType } from "@/types/form.types";
import { useState } from "react";
import { PURCHASE_TYPES } from "@/lib/config/pricing.config";
import { useUserStore } from "@/lib/store/user/user-store";
import { useGetUserPublic } from "@/lib/hooks/tanstack/queries/use-get-user-public";
import { Skeleton } from "../ui/skeleton";

type Package = {
  tier: Packages["package_name"];
  priceId: string;
  productId: string;
  inquiries: number;
  amount: number;
  credits?: number;
  type: "one_time" | "recurring";
  interval?: "month" | "year";
  features: string[];
  title?: string | undefined;
  titleTextClass?: string | undefined;
  cardClass?: string | undefined;
  textClass?: string | undefined;
  image?: StaticImageData | undefined;
};

// TODO: render skeleton UI
export function PackagesCard({ pkg }: { pkg: Package }) {
  const { userId, userRoleId } = useUserStore();
  const { data: user, isLoading } = useGetUserPublic(userId ?? undefined);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handlePackagePurchase() {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const transactionId = uuidv4();
      const idempotencyKey = createIdempotencyKey(
        "checkout",
        user.id,
        "landlord_credits",
        transactionId,
      );

      const purchaseDetails: PurchasePackageFormType = {
        purchaseType: PURCHASE_TYPES.STUDENT_PACKAGE.type,
        priceId: pkg.priceId,
        studentInquiryCount: pkg.inquiries,
        studentPackageName: pkg.tier,
        userId: user.id,
        userEmail: user.email,
        userName: user.full_name!,
        userRoleId: `${user.role_id}` as RoleType,
      };

      const requestBody = {
        ...purchaseDetails,
        idempotencyKey,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
        );

        const stripeError = await stripe?.redirectToCheckout({ sessionId });

        if (stripeError?.error) {
          throw new Error(`Stripe error: ${stripeError.error}`);
        }

        return;
      } else {
        const responseObj: { error: string } = await response.json();
        toast({
          variant: "destructive",
          description: responseObj.error,
          showCloseButton: false,
        });
        throw new Error("There was an error trying to process checkout.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={`relative flex flex-1 flex-col justify-between gap-6 rounded-md border border-gray-600/50 ${pkg.cardClass} px-4 py-5`}
    >
      <div className="z-1 flex flex-col gap-6">
        <section className="flex flex-col gap-2 font-semibold">
          <h2 className={`text-2xl leading-8 ${pkg.titleTextClass}`}>
            {pkg.title}
          </h2>
          <p className="text-text-primary text-4xl leading-11">
            {formatCurrencyToLocale(pkg.amount)}
          </p>
        </section>

        <ul className="flex flex-col gap-3">
          {pkg.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-1">
              <CheckFillIcon className="flex-1" />
              <p className={`${pkg.textClass} flex-1 text-sm leading-6`}>
                {feature}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {isLoading ? (
        <Skeleton className="h-6 w-full animate-pulse" />
      ) : (
        <Button
          onClick={handlePackagePurchase}
          className="z-1 h-fit w-full px-11 py-3 text-base leading-6"
          disabled={isSubmitting}
        >
          {isSubmitting && <LoaderIcon className="size-4 animate-spin" />}
          {isSubmitting ? "Processing..." : "Get Package"}
        </Button>
      )}

      {pkg.image && (
        <Image
          className="absolute top-0 right-0"
          src={pkg.image.src}
          width={pkg.image.width}
          height={pkg.image.height}
          alt={`${pkg.title} illustration`}
        />
      )}
    </div>
  );
}
