import React from "react";
import { ShieldIcon } from "@/public/icons/shield-icon";
import { Button } from "../ui/button";
import Image from "next/image";

function ListingActionModal({
  isOpen,
  onClose,
  variant,
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryAction,
  onSecondaryAction,
}: {
  isOpen: boolean;
  onClose: () => void;
  variant: "success" | "error";
  title?: string;
  message?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 z-100 flex h-full w-screen items-center justify-center bg-black/20 p-4">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-6 rounded-lg bg-white p-4 lg:max-w-120">
        {/* Icon section */}
        <div
          className={`border-foreground w-fit self-center rounded-full border-1 border-solid p-4 ${variant === "success" ? "border-green-200" : "border-red-200"}`}
        >
          {variant === "success" ? (
            <figure className="flex size-50 items-center justify-center rounded-full bg-green-200">
              <ShieldIcon />
            </figure>
          ) : (
            <figure className="flex size-50 items-center justify-center rounded-full bg-red-200">
              <Image
                src="/icons/icon-frown.svg"
                alt="Error Icon"
                width={50}
                height={50}
              />
            </figure>
          )}
        </div>

        {/* Content section */}
        <div className="flex flex-col">
          <h1 className="text-center text-xl leading-7.5 font-semibold sm:leading-11">
            {title ||
              (variant === "success"
                ? "Property listed successfully"
                : "Error Listing Property")}
          </h1>
          <p className="text text-secondary-foreground text-center text-sm">
            {message ||
              (variant === "success"
                ? "200 credits have been deducted from your balance. Now sit back and let a tenant make an inquiry"
                : "An unexpected error occurred. Please try again.")}
          </p>
        </div>

        {/* Buttons section */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          {secondaryButtonText && (
            <Button
              variant="outline"
              className="w-full cursor-pointer text-base leading-6 font-semibold"
              onClick={() => {
                if (onSecondaryAction) onSecondaryAction();
                else onClose();
              }}
            >
              {secondaryButtonText}
            </Button>
          )}
          <Button
            className="w-full cursor-pointer text-base leading-6 font-semibold"
            onClick={() => {
              if (onPrimaryAction) onPrimaryAction();
              else onClose();
            }}
          >
            {primaryButtonText ||
              (variant === "success" ? "Back to listings" : "Try again")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ListingActionModal;
