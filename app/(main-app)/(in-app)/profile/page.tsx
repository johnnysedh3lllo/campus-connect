import { CreditDisplayCard } from "@/components/app/credit-display-card";
import { PremiumBanner } from "@/components/app/premium-banner";
import { ProfileHeader } from "@/components/app/profile-header";
import { ProfilePictureUpload } from "@/components/app/profile-picture-upload";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";
import { EditIcon } from "@/public/icons/edit-icon";
import { MessagesIcon } from "@/public/icons/message-icon";
import { PhoneIconStroke } from "@/public/icons/phone-icon-stroke";
import { ProfileIconSmall } from "@/public/icons/profile-icon-small";
import Link from "next/link";

export default async function ProfilePage() {
  return (
    <>
      <section>
        <div className="bg-background border-border sticky top-0 border-b-1">
          <header className="max-w-screen-max-xl mx-auto flex flex-col justify-between gap-8 p-4 pt-6 sm:flex-row sm:items-center sm:px-12 sm:pt-10 lg:px-0">
            <ProfileHeader />

            <div className="flex flex-1 flex-wrap gap-6">
              <Button
                variant={"outline"}
                className="h-full flex-1 cursor-pointer gap-3 text-base leading-6 sm:flex"
              >
                <Link href="/profile/public">See public view</Link>
              </Button>
              <Button className="h-full flex-1 cursor-pointer gap-3 text-base leading-6 sm:flex">
                Share Profile
              </Button>
            </div>
          </header>
        </div>

        <div className="max-w-screen-max-xl mx-auto px-4 sm:px-12 lg:flex lg:px-0">
          <section className="flex flex-col gap-6 py-6 lg:p-6 lg:pl-0">
            <PremiumBanner />
            <CreditDisplayCard />
          </section>

          <div>
            <Separator orientation="horizontal" className="h-0.25 lg:hidden" />
            <Separator
              orientation="vertical"
              className="hidden w-0.25 lg:block"
            />
          </div>

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
              <section className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <ProfileIconSmall />
                  <p className="text-sm leading-6">John Doe</p>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIconStroke />
                  <Button
                    variant={""}
                    className="p-0 text-sm leading-6 font-normal underline hover:bg-transparent hover:no-underline"
                  >
                    Add Phone Number
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <MessagesIcon />
                  <p className="text-sm leading-6">Johndoe@gmail.com</p>
                </div>
              </section>
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
    </>
  );
}
