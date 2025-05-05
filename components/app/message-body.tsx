"use client";

import { ReactNode } from "react";

export function MessageBody({ children }: { children: ReactNode }) {
  return <div className="relative flex w-full overflow-hidden">{children}</div>;
}
