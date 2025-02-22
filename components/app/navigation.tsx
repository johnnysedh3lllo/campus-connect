// COMPONENTS
import Link from "next/link";
import Image from "next/image";
import HeaderAuth from "@/components/app/header-auth";

// ASSETS
import logoMain from "@/public/logos/logo-primary.svg";
import notificationIcon from "@/public/icons/icon-notifications.svg";
import hamburgerIcon from "@/public/icons/icon-hamburger.svg";

export default function Navigation({ route }: { route: string }) {
  return (
    <nav className="bg-background border-b-foreground/10 sticky top-0 flex h-16 w-full justify-center border-b">
      <div className="flex w-full max-w-screen-2xl items-center justify-between p-4 text-sm lg:px-6 lg:pt-6 lg:pb-3">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={route}>
            <Image
              src={logoMain}
              alt="primary campus connect logo"
              width={75}
              height={25}
            />
          </Link>
        </div>

        <div className="flex gap-4">
          <figure className="bg-background-secondary flex h-10 w-10 items-center justify-center rounded-full">
            <Image
              src={notificationIcon}
              width={24}
              height={24}
              alt="notification icon"
            />
          </figure>

          <figure className="bg-background-secondary flex h-10 w-10 items-center justify-center rounded-full">
            <Image
              src={hamburgerIcon}
              width={24}
              height={24}
              alt="navigation menu icon"
            />
          </figure>
        </div>
        <HeaderAuth />
      </div>
    </nav>
  );
}
