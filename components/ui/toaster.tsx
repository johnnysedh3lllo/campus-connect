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

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const isDestructive = props.variant === "destructive";

        // TODO: Setup Variants for 'Success' and 'Info'
        // const isSuccess = props.variant === "success";
        // const isInfo = props.variant === "info";
        return (
          <Toast key={id} {...props} className="flex w-fit items-center">
            <div className="flex items-start gap-3">
              {isDestructive && <ErrorIcon />}
              <section className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </section>
            </div>
            {action ? action : <ToastClose className="self-center" />}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
