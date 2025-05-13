import LoginPage from "@/components/app/page-containers/auth/login-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return <LoginPage />;
}
