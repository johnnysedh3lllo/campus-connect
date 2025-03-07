"use client";

import { useProfileViewStore } from "@/lib/store/profile-view-store";
import { ReactNode } from "react";

export function MessageBody({ children }: { children: ReactNode }) {

  return <div className="flex relative overflow-hidden w-full">{children}</div>;
}
