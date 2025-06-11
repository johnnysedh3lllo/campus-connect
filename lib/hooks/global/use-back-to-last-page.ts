"use client";

import { useRouter } from "next/navigation";

export function useBackToLastPage(fallbackRoute: string) {
  const router = useRouter();

  return () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackRoute);
    }
  };
}
