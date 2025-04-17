import React, { useEffect, useRef } from "react";
import { ShieldIcon } from "@/public/icons/shield-icon";
import { Button } from "../ui/button";
import { FrownIcon } from "@/public/icons/icon-frown";

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
  icon,
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
  icon?: React.ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleOutsideClick = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 z-100 flex h-full w-screen items-center justify-center bg-black/20 p-4"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="mx-auto flex w-full flex-col items-center justify-center gap-6 rounded-lg bg-white p-4 lg:max-w-120"
      >
        {/* Icon section */}
        <div
          className={`border-foreground w-fit self-center rounded-full border-1 border-solid p-4 ${
            variant === "success" ? "border-green-200" : "border-red-200"
          }`}
        >
          <figure
            className={`flex size-50 items-center justify-center rounded-full ${
              variant === "success" ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {icon ? (
              icon
            ) : variant === "success" ? (
              <ShieldIcon />
            ) : (
              <FrownIcon size={50} />
            )}
          </figure>
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
