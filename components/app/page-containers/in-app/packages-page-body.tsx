"use client";
import { Button } from "@/components/ui/button";
import { Header } from "../../header";
import { CheckFillIcon } from "@/public/icons/check-fill-icon";
import firstPlaceIllustration from "@/public/illustrations/first-place-medal-illustration.png";
import secondPlaceIllustration from "@/public/illustrations/second-place-medal-illustration.png";
import thirdPlaceIllustration from "@/public/illustrations/third-place-medal-illustration.png";
import Image from "next/image";
import { PRICING, PURCHASE_TYPES } from "@/lib/config/pricing.config";
import { formatCurrencyToLocale, formatUsersName } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetUser } from "@/hooks/tanstack/use-get-user";
import { purchasePackageFormSchema } from "@/lib/form.schemas";
import {
  PurchasePackageFormType,
  UserValidationType,
} from "@/types/form.types";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// TODO: DEVISE A MEANS TO ENSURE THE USER OBJECT IS AVAILABLE BEFORE THIS COMPONENT MOUNTS
// TODO: CONSIDER PREFETCHING THE USER HERE
export function PackagesPageBody() {
  const { data: user } = useGetUser();
  const userId = user?.id;
  const userRoleId: UserValidationType["roleId"] = user?.user_metadata.role_id;
  const usersName = user?.user_metadata
    ? formatUsersName(user.user_metadata)
    : undefined;
  const userEmail = user?.email;

  const packagesData = [
    {
      tier: "bronze",
      title: "Bronze Package",
      titleTextClass: "text-[#8A4A21]",
      cardClass:
        "bg-[linear-gradient(180deg,_#FFCEAF_-38.26%,_#FFF_46.65%)] lg:min-h-[409px]",
      textClass: "text-text-secondary font-medium",
      image: thirdPlaceIllustration,
    },
    {
      tier: "silver",
      title: "Silver Package",
      titleTextClass: "text-[#786A88] lg:text-4xl",
      cardClass:
        "bg-[linear-gradient(180deg,_#D1BFE4_-38.26%,_#FFF_43.86%)] row-start-1 row-end-2 lg:min-h-[488px]",
      textClass: "text-text-primary font-semibold",
      image: secondPlaceIllustration,
    },
    {
      tier: "gold",
      title: "Gold Package",
      titleTextClass: "text-[#B16000]",
      cardClass:
        "bg-[linear-gradient(180deg,_#FEC889_-38.26%,_#FFF_46.65%)] lg:min-h-[409px]",
      textClass: "text-text-secondary font-medium",
      image: firstPlaceIllustration,
    },
  ];

  const newPackagesData = Object.values(PRICING.student).map((pkg) => {
    const packageData = packagesData.find(
      (pkgData) => pkgData.tier == pkg.tier,
    );

    return {
      ...packageData,
      ...pkg,
    };
  });

  async function handlePackagePurchase(values: PurchasePackageFormType) {
    console.log(values);

    const priceId = values.priceId;
    const purchaseType = values.purchaseType;
    const studentInquiryCount = values.studentInquiryCount;
    const studentPackageName = values.studentPackageName;
    const userId = values.userId;
    const userEmail = values.userEmail;
    const usersName = values.usersName;
    const userRoleId = values.userRoleId;

    try {
      const requestBody = {
        priceId,
        purchaseType,
        studentInquiryCount,
        studentPackageName,
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
        const responseObj: { error: string } = await response.json();
        toast({
          variant: "destructive",
          description: responseObj.error,
          showCloseButton: false,
        });
        throw new Error(
          "There was an error trying to process checkout, please try again:",
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="mx-auto max-w-screen-2xl">
      <Header
        title="Upgrade Packages"
        subTitle="Purchase packages whenever you want."
      />

      <section className="flex flex-col gap-6 px-4 py-6 sm:gap-12 sm:px-10 lg:gap-14">
        <section className="mx-auto flex max-w-xl flex-col gap-3 text-center">
          <h2 className="text-base leading-6 font-semibold text-black">
            Our Packages
          </h2>

          <p className="text-sm leading-6 text-gray-900">
            With these packages, Campus Connect ensures a hassle-free experience
            in finding the perfect off-campus housing for you.
          </p>
        </section>

        <section className="lg max-w-screen-max-xl mx-auto grid grid-cols-1 gap-6 lg:flex lg:flex-row lg:items-center lg:gap-x-6 lg:gap-y-0">
          {newPackagesData.map((pkg, index) => {
            const formValues = {
              purchaseType: PURCHASE_TYPES.STUDENT_PACKAGE.type,
              priceId: pkg.priceId,
              studentInquiryCount: pkg.inquiries,
              studentPackageName: pkg.tier,
              userId: userId ?? undefined,
              userEmail,
              usersName,
              userRoleId,
            };

            const form = useForm<PurchasePackageFormType>({
              resolver: zodResolver(purchasePackageFormSchema),
              defaultValues: formValues,
            });

            const {
              handleSubmit,
              formState: { isSubmitting },
            } = form;

            return (
              <div
                key={index}
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
                        <p
                          className={`${pkg.textClass} flex-1 text-sm leading-6`}
                        >
                          {feature}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <Form {...form}>
                  <form onSubmit={handleSubmit(handlePackagePurchase)}>
                    <Button
                      type="submit"
                      className="z-1 h-fit w-full px-11 py-3 text-base leading-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {isSubmitting ? "Processing..." : "Get Package"}
                    </Button>
                  </form>
                </Form>

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
          })}
        </section>
      </section>
    </section>
  );
}
