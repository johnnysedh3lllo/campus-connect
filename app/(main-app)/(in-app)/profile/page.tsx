// UTILITIES
import { getUser } from "@/app/actions/actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

// COMPONENTS
import { CreditDisplayCard } from "@/components/app/credit-display-card";
import { PremiumBanner } from "@/components/app/premium-banner";
import { ProfileHeader } from "@/components/app/profile-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// ASSETS
import { EditIcon } from "@/public/icons/edit-icon";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";
import { ProfileInfo } from "@/components/app/profile-info";

export default async function ProfilePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <section>
          <div className="bg-background border-border sticky top-0 border-b-1">
            <header className="max-w-screen-max-xl mx-auto flex flex-col justify-between gap-8 p-4 pt-6 sm:flex-row sm:items-center sm:px-12 sm:pt-10">
              <ProfileHeader />

              {/* 
              <div className="flex flex-1 flex-wrap gap-6 lg:max-w-84">
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

          <div className="max-w-screen-max-xl mx-auto px-4 sm:px-12 lg:flex">
            <section className="flex flex-col gap-6 py-6 lg:p-6 lg:pl-0">
              <PremiumBanner />
              <CreditDisplayCard />
            </section>

            <div>
              <Separator
                orientation="horizontal"
                className="h-0.25 lg:hidden"
              />
              <Separator
                orientation="vertical"
                className="hidden w-0.25 lg:block"
              />
            </div>

            {/* PROFILE INFO */}
            <section className="flex w-full flex-col gap-6 py-6 lg:p-6 lg:pr-0">
              <section className="flex flex-col gap-3">
                <header className="flex w-full items-center justify-between">
                  <h2 className="text-2xl leading-6 font-semibold">
                    Profile Info
                  </h2>
                  <Button
                    variant={"outline"}
                    className="size-10 rounded-full p-0"
                  >
                    <EditIcon />
                  </Button>
                </header>

                <ProfileInfo />
              </section>

              <Separator orientation="horizontal" />

              <section>
                <header className="flex items-center justify-between">
                  <section>
                    <h2 className="text-2xl leading-6 font-semibold">
                      Current plan
                    </h2>
                    <p>Basic</p>
                  </section>

                  <Link href="/">
                    <Button
                      variant={"outline"}
                      className="h-full flex-1 cursor-pointer gap-3 text-base leading-6 sm:flex"
                    >
                      View plans
                      <ChevronRightIcon />
                    </Button>
                  </Link>
                </header>
              </section>
            </section>
          </div>
        </section>
      </HydrationBoundary>
    </>
  );
}
