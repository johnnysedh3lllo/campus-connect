import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ModalProps } from "@/lib/prop.types";

const variants = {
  default: {
    border: "border-transparent border-0 p-0",
    background: "bg-transparent",
  },
  neutral: {
    border: "border-border-line p-4",
    background: "bg-background-secondary",
  },
  // TODO: this color below is not in the design system,
  // TODO: please find a way to incorporate it
  success: {
    border: "border-green-700 p-4",
    background: "bg-green-700/10",
  },
  error: {
    border: "border-primary p-4",
    background: "bg-primary/10",
  },
};

export default function Modal({
  variant = "default",
  modalId,
  triggerButton,
  title,
  description,
  modalImage,
  showCloseButton,
  modalActionButton,
  clearParamAfterOpen,
  open,
  setOpen,
  children,
}: ModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const modalParams = searchParams.get("modalId");

    if (modalId && modalParams === modalId && setOpen) {
      setOpen(true);
      if (clearParamAfterOpen) {
        router.replace(window.location.pathname);
      }
    }
  }, [searchParams, modalId, clearParamAfterOpen, router]);

  const styles = variants[variant];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton && triggerButton}</DialogTrigger>
      <DialogContent className="max-w-[550px] px-4 py-6 sm:p-8">
        <section className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col items-center gap-2">
            {showCloseButton && (
              <DialogClose className="self-end">
                <CloseIconNoBorders className="size-10" />
              </DialogClose>
            )}

            {/* TODO: ADD MULTIPLE VARIANTS FOR THIS DIV'S BORDER COLOR AND BACKGROUND COLOR OF THE FIGURE INSIDE IT. */}
            {/* VARIANTS: SUCCESS, ERROR, NEUTRAL, DEFAULT */}
            <div
              className={`w-fit self-center rounded-full border-1 border-solid ${styles.border}`}
            >
              <figure
                className={`flex size-50 items-center justify-center rounded-full ${styles.background}`}
              >
                {modalImage}
              </figure>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <DialogHeader className="flex flex-col gap-2 sm:text-center">
              <DialogTitle className="text-xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
                {title}
              </DialogTitle>
              <DialogDescription className="text text-secondary-foreground text-sm">
                {description}
              </DialogDescription>
            </DialogHeader>

            {modalActionButton && (
              <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen && setOpen(false)}
                  className="flex w-full flex-1 items-center px-0"
                >
                  Cancel
                </Button>

                {modalActionButton}
              </div>
            )}
            {children && children}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
