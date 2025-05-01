import React, { useState } from "react";
import { ShieldIcon } from "@/public/icons/shield-icon";
import { Button } from "../ui/button";
import { FrownIcon } from "@/public/icons/icon-frown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { ListingActionModalProps } from "@/lib/prop.types";
import { Toaster } from "../ui/toaster";

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
}: ListingActionModalProps) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const resolvedIcon = icon ? (
    icon
  ) : variant === "success" || variant === "warning" ? (
    <ShieldIcon />
  ) : (
    <FrownIcon size={50} />
  );

  const resolvedTitle =
    title ||
    (variant === "success"
      ? "Property listed successfully"
      : "Error Listing Property");

  const resolvedMessage =
    message ||
    (variant === "success"
      ? "200 credits have been deducted from your balance. Now sit back and let a tenant make an inquiry"
      : "An unexpected error occurred. Please try again.");

  const primaryText =
    primaryButtonText ||
    (variant === "success" ? "Back to listings" : "Try again");

  const borderClass =
    variant === "success"
      ? "border-green-200"
      : variant === "warning"
        ? "border-line"
        : "border-text-accent";

  const bgClass =
    variant === "success"
      ? "bg-green-200"
      : variant === "warning"
        ? "bg-background-secondary"
        : "bg-red-200";

  // Handlers
  const handleSecondaryClick = async () => {
    setIsButtonDisabled(true);
    try {
      if (onSecondaryAction) {
        await onSecondaryAction();
      } else {
        onClose();
      }
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handlePrimaryClick = async () => {
    setIsButtonDisabled(true);
    try {
      if (onPrimaryAction) {
        await onPrimaryAction();
      } else {
        onClose();
      }
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Render
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="p-4">
      <div  className="flex w-full max-w-120 flex-col items-center justify-center gap-6 rounded-lg bg-white p-4">
          {/* Icon section */}
          <div
            className={`border-foreground w-fit self-center rounded-full border-1 border-solid p-4 ${borderClass}`}
          >
            <figure
              className={`flex size-50 items-center justify-center rounded-full ${bgClass}`}
            >
              {resolvedIcon}
            </figure>
          </div>
          {/* Title and message section using shadcn DialogHeader */}
          <DialogHeader className="flex w-full flex-col items-center">
            <DialogTitle className="text-center text-xl leading-7.5 font-semibold sm:leading-11">
              {resolvedTitle}
            </DialogTitle>
            <DialogDescription className="text text-secondary-foreground text-center text-sm">
              {resolvedMessage}
            </DialogDescription>
          </DialogHeader>
          {/* Buttons section */}
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            {secondaryButtonText && (
              <Button
                variant="outline"
                className="w-full cursor-pointer text-base leading-6 font-semibold"
                onClick={handleSecondaryClick}
                disabled={isButtonDisabled}
              >
                {secondaryButtonText}
              </Button>
            )}
            <Button
              className="w-full cursor-pointer text-base leading-6 font-semibold"
              onClick={handlePrimaryClick}
              disabled={isButtonDisabled}
            >
              {primaryText}
            </Button>
          </div>
      </div>
      <Toaster />
        </DialogContent>
    </Dialog>
  );
}

export default ListingActionModal;
