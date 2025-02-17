import Image from "next/image";
import FacebookIcon from "@/public/logos/logo-facebook.svg";
import GoogleIcon from "@/public/logos/logo-google.svg";
import AppleIcon from "@/public/logos/logo-apple.svg";
import Link from "next/link";

export function Facebook() {
  return (
    <Link href="#" className="border-border border-1 border-solid p-3 rounded-full">
      <Image width={24} height={24} src={FacebookIcon} alt="facebook icon" />
    </Link>
  );
}

export function Google() {
  return (
    <Link href="#" className="border-border border-1 border-solid p-3 rounded-full">
      <Image width={24} height={24} src={GoogleIcon} alt="google icon" />
    </Link>
  );
}

export function Apple() {
  return (
    <Link href="#" className="border-border border-1 border-solid p-3 rounded-full">
      <Image width={24} height={24} src={AppleIcon} alt="apple icon" />
    </Link>
  );
}
