"use client";

import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

export function OnboardingFlowWrapper({
  currentStep,
  totalSteps,
  children,
}: {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
}) {
  const onboardingFormWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="onboarding-form--wrapper flex flex-col px-2 lg:w-full lg:overflow-x-hidden lg:overflow-y-auto"
      ref={onboardingFormWrapperRef}
    >
      <div className="bg-background sticky top-0 z-5 flex gap-1 py-4 lg:pe-4">
        <Badge variant="outline">{`${currentStep + 1}/${totalSteps}`}</Badge>

        <div className="flex w-full items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div className="bg-accent-secondary w-full h-0.5" key={`step-${index}`}>
              <div
                className={`h-full transition-all duration-500 ${index <= currentStep ? "bg-primary w-full" : "w-0"}`}
              ></div>
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
