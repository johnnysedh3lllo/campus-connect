import { ProfilePictureUpload } from "@/components/app/profile-picture-upload";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfilePage() {

  
  return (
    <>
      <div className="bg-background border-border sticky top-0 border-b-1">
        <header className="max-w-screen-max-xl mx-auto flex flex-col justify-between gap-8 p-4 pt-6 sm:flex-row sm:items-center sm:px-12 sm:pt-10">
          <div className="flex flex-1 shrink-0 items-center gap-7 sm:gap-5">
            <ProfilePictureUpload />

            <section>
              <h1 className="text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
                John Doe
              </h1>
              <p className="text-text-secondary text-sm leading-6">
                johndoe@gmail.com
              </p>
            </section>
          </div>

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
    </>
  );
}
