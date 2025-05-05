"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

import { ErrorIcon } from "@/public/icons/error-icon";
import { SuccessCheckIcon } from "@/public/icons/success-check-icon";
import { InfoIcon } from "@/public/icons/info-icon";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        showCloseButton = true,
        ...props
      }) {
        const isDestructive = props.variant === "destructive";
        const isSuccess = props.variant === "success";
        const isInfo = props.variant === "info";
        const isWarning = props.variant === "warning";

        return (
          <Toast
            key={id}
            {...props}
            className="flex w-fit items-center text-sm leading-6"
          >
            <div className="flex items-start gap-3">
              {isDestructive && <ErrorIcon />}
              {isSuccess && <SuccessCheckIcon />}
              {isInfo && <InfoIcon />}
              {isWarning && <ErrorIcon />}

              <section className="grid gap-1 self-center">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </section>
            </div>
            {action && action}
            {showCloseButton && <ToastClose className="self-center" />}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
