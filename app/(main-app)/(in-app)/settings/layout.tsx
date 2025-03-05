import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Settings",
};
const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}<Toaster /></>;
};

export default SettingsLayout;
