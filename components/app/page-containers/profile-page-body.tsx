"use client";

// COMPONENTS
import { CreditDisplayCard } from "@/components/app/credit-display-card";
import { PremiumBanner } from "@/components/app/premium-banner";
import { ProfileHeader } from "@/components/app/profile-header";
import { Separator } from "@/components/ui/separator";
// ASSETS
import { useGetUser } from "@/hooks/tanstack/use-get-user";
import { useGetUserPublic } from "@/hooks/tanstack/use-get-user-public";
import { ProfileInfo } from "../profile-info";
import { useGetActiveSubscription } from "@/hooks/tanstack/use-get-active-subscription";
import { ProfileHeaderSkeleton } from "../skeletons/profile-header-skeleton";
import { ProfileInfoSkeleton } from "../skeletons/profile-info-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";
import { Form } from "../../ui/form";
import { useForm } from "react-hook-form";
import { ToastAction } from "../../ui/toast";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export function ProfilePageBody() {
  const [billingPortalUrl, setBillingPortalUrl] = useState<string | null>(null);

  const { data: user } = useGetUser();
  const userId = user?.id;
  const { data: userProfile } = useGetUserPublic(userId);
  const { data: userActiveSubscription } = useGetActiveSubscription(userId);

  const userCurrentPlan = userActiveSubscription ? "Premium" : "Basic";

  const form = useForm();

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  // // TODO: DRY this up in other places, maybe abstract into a file
  // async function createPortalSession(
  //   userId: User["id"] | undefined,
  // ): Promise<string> {
  //   const response = await fetch("/api/billing-portal", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ userId }),
  //   });

  //   if (!response.ok) {
  //     throw new Error("Failed to create billing portal session.");
  //   }

  //   const { url } = await response.json();
  //   return url;
  // }

  // // Preload portal session on mount
  // useEffect(() => {
  //   async function preloadBillingPortal() {
  //     if (!userId) return;

  //     try {
  //       const url = await createPortalSession(userId);
  //       setBillingPortalUrl(url);
  //     } catch (error: any) {
  //       console.error(error);
  //     }
  //   }

  //   preloadBillingPortal();
  // }, [userId]);

  // async function handleRedirect() {
  //   try {
  //     if (!userId) {
  //       throw new Error(
  //         "Some necessary details are missing. Please reload and try again later.",
  //       );
  //     }

  //     let url = billingPortalUrl;

  //     // If not preloaded, fetch on demand
  //     if (!url) {
  //       const portalUrl = await createPortalSession(userId);
  //       url = portalUrl;
  //       setBillingPortalUrl(url); // cache for future
  //     }

  //     window.location.href = url!;
  //   } catch (error: any) {
  //     if (error instanceof Error) {
  //       toast({
  //         variant: "default",
  //         description: error.message,
  //         action: <ToastAction altText="Try again">Try again</ToastAction>,
  //       });
  //     }
  //     console.error(error);
  //   }
  // }

  return (
    <section>
      <div className="bg-background border-border sticky z-2 border-b-1 p-0">
        <header className="max-w-screen-max-xl mx-auto flex flex-col justify-between gap-8 p-4 pt-6 sm:flex-row sm:items-center sm:px-12 sm:pt-10">
          {userProfile ? (
            <ProfileHeader userProfile={userProfile} />
          ) : (
            <ProfileHeaderSkeleton />
          )}

          {/* <div className="flex flex-1 flex-wrap gap-6 lg:max-w-84">
            <Button
              variant={"outline"}
              className="h-full flex-1 cursor-pointer gap-3 text-base leading-6 sm:flex"
            >
              <Link href="/profile/public">See public view</Link>
            </Button>
            <Button className="h-full flex-1 cursor-pointer gap-3 text-base leading-6 sm:flex">
              Share Profile
            </Button>
          </div> */}
        </header>
      </div>

      <div className="max-w-screen-max-xl mx-auto grid grid-cols-1 px-4 sm:px-12 lg:grid-cols-[1.5fr_2fr]">
        <section className="lg:flex">
          <section className="flex flex-col gap-6 py-6 lg:w-full lg:p-6 lg:pl-0">
            {/* TODO: REFACTOR */}

            {/* {userActiveSubscription ? ( */}
            <CreditDisplayCard userId={userId} />
            {/* ) : ( */}
            {/* <CreditDisplayCardSkeleton /> */}
            {/* )} */}
            {!userActiveSubscription && <PremiumBanner />}
          </section>
          <div>
            <Separator orientation="horizontal" className="h-0.25 lg:hidden" />
            <Separator
              orientation="vertical"
              className="hidden w-0.25 lg:block"
            />
          </div>
        </section>

        <section className="flex w-full flex-col gap-6 py-6 lg:p-6 lg:pr-0">
          {/* PROFILE INFO */}

          {userProfile ? (
            <ProfileInfo userProfile={userProfile} />
          ) : (
            <ProfileInfoSkeleton />
          )}

          <Separator orientation="horizontal" />

          <header className="flex items-center justify-between">
            <section>
              <h2 className="text-2xl leading-6 font-semibold">Current plan</h2>

              {/* TODO: REFACTOR */}
              <p>{userCurrentPlan}</p>
            </section>

            <Link href="/plans">
              <Button
                variant={"outline"}
                className="h-full flex-1 cursor-pointer gap-3 text-base leading-6 sm:flex"
              >
                View plans
                <ChevronRightIcon />
              </Button>
            </Link>
            {/* {!userActiveSubscription ? (
              <></>
            ) : (
              <Form {...form}>
                <form onSubmit={handleSubmit(handleRedirect)}>
                  <Button
                    variant={"outline"}
                    disabled={isSubmitting}
                    className="h-full cursor-pointer gap-3 text-base leading-6 sm:flex"
                  >
                    Manage Plans
                    <ChevronRightIcon />
                  </Button>
                </form>
              </Form>
            )} */}
          </header>
        </section>
      </div>
    </section>
  );
}
