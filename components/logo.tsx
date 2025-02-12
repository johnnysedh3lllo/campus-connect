import Image from "next/image";
import mobileLogo from "@/public/logos/logo-mobile.svg";
import tabletLogo from "@/public/logos/logo-tablet.svg";
import desktopLogo from "@/public/logos/logo-desktop.svg";

export default function Logo() {
  return (
    <>
      <Image
        width="81"
        height="24"
        alt="campus connect logo mobile"
        src={mobileLogo}
        className="sm:hidden"
      />
      <Image
        width="135"
        height="41"
        alt="campus connect logo tablet"
        src={tabletLogo}
        className="hidden sm:block lg:hidden"
      />
      <Image
        width="277"
        height="83"
        alt="campus connect logo desktop"
        src={desktopLogo}
        className="hidden lg:block"
      />
    </>
  );
}
