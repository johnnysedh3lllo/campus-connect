"use client";

// COMPONENTS
import { CreditDisplayCard } from "@/components/app/credit-display-card";
import { PremiumBanner } from "@/components/app/premium-banner";
import { ProfileHeader } from "@/components/app/profile-header";
import { Separator } from "@/components/ui/separator";
// ASSETS
import { useGetUserPublic } from "@/hooks/tanstack/use-get-user-public";
import { ProfileInfo } from "../profile-info";
import { useGetActiveSubscription } from "@/hooks/tanstack/use-get-active-subscription";
import { ProfileHeaderSkeleton } from "../skeletons/profile-header-skeleton";
import { ProfileInfoSkeleton } from "../skeletons/profile-info-skeleton";
import { RoleGate } from "../role-gate";
import { useStudentData } from "@/hooks/role-based/use-student-data";
import { useUserStore } from "@/lib/store/user-store";
import UserTierSummary from "../user-tier-summary";

export function ProfilePageBody() {
  const { userId, userRoleId } = useUserStore();

  const { data: userProfile } = useGetUserPublic(userId || undefined);

  const { data: activeSubscription } = useGetActiveSubscription(
    userId || undefined,
    userRoleId,
  );

  const whois = userRoleId == 2 ? "landlord" : "student";

  console.log(whois, activeSubscription);

  const { packageDetails } = useStudentData(userId || undefined, userRoleId);

  const userCurrentPlan = activeSubscription ? "Premium" : "Basic";
  const userCurrentPackage = packageDetails ? "Silver" : "None";

  return (
    <section>
      <div className="bg-background border-border sticky top-0 z-2 border-b-1 p-0">
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
            <RoleGate userRoleId={userRoleId} role="LANDLORD">
              <CreditDisplayCard />
              {!activeSubscription && (
                <PremiumBanner
                  description="Find the perfect tenants in any location you choose to list & get expert support from us!"
                  buttonText="Get Premium"
                  href="/plans"
                />
              )}
            </RoleGate>

            <RoleGate userRoleId={userRoleId} role="TENANT">
              {!packageDetails && (
                <PremiumBanner
                  description="Find the perfect off campus housing in any location Tailored to your preferences"
                  buttonText="Upgrade Package"
                  href="/packages"
                />
              )}
            </RoleGate>
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

          <RoleGate userRoleId={userRoleId} role="LANDLORD">
            <UserTierSummary
              tier="plan"
              currentTier={userCurrentPlan}
              buttonText="plans"
              href="/plans"
            />
          </RoleGate>

          <RoleGate userRoleId={userRoleId} role="TENANT">
            <UserTierSummary
              tier="package"
              currentTier={userCurrentPackage}
              buttonText="packages"
              href="/packages"
            />
          </RoleGate>
        </section>
      </div>
    </section>
  );
}

{
  /* {!activeSubscription ? (
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
)} */
}
