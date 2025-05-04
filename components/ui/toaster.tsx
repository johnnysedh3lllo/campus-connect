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

        // TODO: Setup Variants for 'Success' and 'Info'
        // const isInfo = props.variant === "info";
        return (
          <Toast key={id} {...props} className="flex w-fit items-center">
            <div className="flex items-start gap-3">
              {isDestructive && <ErrorIcon />}
              {isSuccess && <SuccessCheckIcon />}

              <section className="grid gap-1">
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
