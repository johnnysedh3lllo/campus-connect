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

import errorIcon from "@/public/icons/icon-error.svg";
import Image from "next/image";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex gap-3 items-start">
              <Image width={24} height={24} src={errorIcon} alt="" />
              <section className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </section>
            </div>
            {action}
            <ToastClose className="self-center" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
