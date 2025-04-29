"use client";
import { CreditBalanceProps } from "@/lib/prop.types";
import { CreditChipIcon } from "@/public/icons/credit-chip-icon";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils"; // assuming you have a cn() utility for classNames
import React from "react";
import { CreditBalanceSkeleton } from "./skeletons/credit-balance-skeleton";

function CreditBalanceComponent(
  props: CreditBalanceProps,
  ref: React.Ref<HTMLButtonElement | HTMLDivElement>,
) {
  const {
    creditAmount,
    isClickable,
    increment,
    className = "flex items-center gap-2",
    disabled,
    ...restProps
  } = props;

  const amount = creditAmount ?? 0;
  const displayedAmount = increment ? amount + increment : amount;

  if (isClickable) {
    return (
      <Button
        ref={ref as React.Ref<HTMLButtonElement>} // Cast because Button expects button ref
        variant={"ghost"}
        disabled={disabled}
        className={cn(
          "hover:bg-background-secondary hidden items-center justify-center rounded-sm p-2 lg:flex",
          className,
        )}
        {...restProps}
      >
        <CreditChipIcon />
        <p className="text-sm leading-6 font-medium">
          {displayedAmount} Credits
        </p>
      </Button>
    );
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>} // Cast because Div expects div ref
      className={cn(className)}
      {...restProps}
    >
      <CreditChipIcon />
      <p className="text-sm leading-6 font-medium">{displayedAmount} Credits</p>
    </div>
  );
}

export const CreditBalance = React.forwardRef(CreditBalanceComponent);

CreditBalance.displayName = "CreditBalance";
