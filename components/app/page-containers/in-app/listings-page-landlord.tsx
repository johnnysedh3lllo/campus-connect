"use client";
import { Button } from "@/components/ui/button";
import { RoleGate } from "../../role-gate";
import Link from "next/link";
import { PlusIcon } from "@/public/icons/plus-icon";
import { CreateListingsButton } from "../../action-buttons";
import { EmptyPageState } from "../../empty-page-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import listingIllustration from "@/public/illustrations/illustration-listings.png";
import { Header } from "../../header";
import { useUserStore } from "@/lib/store/user-store";
import { PublicationStatusType } from "@/types/form.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetActiveSubscription } from "@/hooks/tanstack/use-get-active-subscription";
import { PremiumBanner } from "../../premium-banner";
import { ListingsPageContainer } from "../../listings-page-container";
import { UseGetListingsType } from "@/hooks/tanstack/use-get-listings";
import { Suspense } from "react";

export function ListingsPageLandlord() {
  const { userId, userRoleId } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get("tab") ??
    "published") as PublicationStatusType;

  const { data: activeSubscription } = useGetActiveSubscription(
    userId || undefined,
    userRoleId,
  );

  const tabData = [
    {
      label: "Published",
      value: "published",
      props: {
        currStatus: activeTab,
        pubStatus: "published",
        userId: userId ?? undefined,
      },
    },
    {
      label: "unpublished",
      value: "unpublished",
      props: {
        currStatus: activeTab,
        pubStatus: "unpublished",
        userRoleId: userRoleId ?? undefined,
        userId: userId ?? undefined,
      },
    },
    {
      label: "Drafts",
      value: "draft",
      props: {
        currStatus: activeTab,
        pubStatus: "draft",
        userRoleId: userRoleId ?? undefined,
        userId: userId || undefined,
      },
    },
  ];

  const updateActiveTab = (value: PublicationStatusType) => {
    router.push(`?tab=${value}`);
  };

  return (
    <RoleGate userRoleId={userRoleId} role="LANDLORD">
      {!activeSubscription && (
        <section className="lg:max-w-screen-max-xl px-4 py-6 sm:px-6 sm:pt-10 sm:pb-6 lg:mx-auto">
          <PremiumBanner
            description="Find the perfect tenants in any location you choose to list & get expert support from us!"
            buttonText="Get Premium"
            href="/plans"
          />
        </section>
      )}

      <section>
        <Header
          title="Listings"
          subTitle="Here are all the houses you have listed"
        >
          <CreateListingsButton />
        </Header>

        <Tabs
          value={activeTab}
          onValueChange={(value: string) =>
            updateActiveTab(value as PublicationStatusType)
          }
          className="w-full gap-0 pb-6"
        >
          {/* TODO: DEVISE A WAY TO REMOVE ACHIEVE STICKY WITHOUT THIS ARBITRARY top-[105px] */}
          <TabsList className="bg-background-secondary sticky top-[105px] z-20 w-full items-end justify-start gap-3 rounded-none border-b p-0 pt-6 sm:top-[125px]">
            <div className="max-w-screen-max-xl mx-auto w-full">
              <div className="listing-image-preview-container flex h-full w-full max-w-fit items-end gap-3 overflow-x-auto px-4 sm:px-6">
                {tabData.map((tab) => {
                  // const totalItems = tab.content?.reduce(
                  //   (acc, curr) => acc + (curr?.data?.length ?? 0),
                  //   0,
                  // );
                  // {
                  //   totalItems ? `(${totalItems})` : "(-)";
                  // }

                  return (
                    <TabsTrigger
                      className="data-[state=active]:bg-background-accent-secondary focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring hover:bg-background-accent-secondary/50 data-[state=active]:border-text-disabled data-[state=active]:text-text-accent text-text-secondary p-3 capitalize focus-visible:ring-[3px] focus-visible:outline-1"
                      key={tab.value}
                      value={tab.value}
                    >
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </div>
            </div>
          </TabsList>

          <Suspense
            fallback={
              <EmptyPageState
                imageSrc={listingIllustration.src}
                title="You have no listings yet"
                subTitle="Kick start your journey with us by making your first listing. Clicking the button below"
                button={<CreateListingsButton />}
              />
            }
          >
            {tabData.map((tab) => {
              const props = tab.props as UseGetListingsType;
              return (
                <TabsContent key={`${tab.value}`} value={tab.value}>
                  <ListingsPageContainer
                    pubStatus={props.pubStatus}
                    currStatus={props.currStatus}
                    userId={props.userId}
                    userRoleId={props.userRoleId}
                  />
                </TabsContent>
              );
            })}
          </Suspense>
        </Tabs>

        <Link href="/listings/create">
          <Button className="fixed right-4 bottom-4 z-20 rounded-md p-4 sm:hidden">
            <PlusIcon />
          </Button>
        </Link>
      </section>
    </RoleGate>
  );
}
