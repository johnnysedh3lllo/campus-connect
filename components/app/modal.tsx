import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type ModalVariants = "default" | "neutral" | "success" | "error";
type ModalProps = {
  modalId?: string;
  variant?: ModalVariants;
  triggerButton?: React.ReactNode;
  title: string;
  description: string;
  modalImage: React.ReactNode;
  showCloseButton?: boolean;
  modalActionButton?: React.ReactNode;
  clearParamAfterOpen?: boolean;
  children?: React.ReactNode;
};

const variants = {
  default: {
    border: "border-transparent",
    background: "bg-transparent",
  },
  neutral: {
    border: "border-border-line",
    background: "bg-background-secondary",
  },
  // TODO: this color below is not in the design system,
  // TODO: please find a way to incorporate it
  success: {
    border: "border-green-700",
    background: "bg-green-700/10",
  },
  error: {
    border: "border-primary",
    background: "bg-primary/10",
  },
};

export function Modal({
  variant = "default",
  modalId,
  triggerButton,
  title,
  description,
  modalImage,
  showCloseButton,
  modalActionButton,
  clearParamAfterOpen,
  children,
}: ModalProps) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const modalParams = searchParams.get("modal");

    if (modalId && modalParams === modalId) {
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
      <DialogContent className="max-w-[542px] px-4 py-6 sm:p-12">
        <section className="flex flex-col gap-6 sm:gap-12">
          <div className="flex flex-col items-center gap-2">
            {showCloseButton && (
              <DialogClose className="self-end">
                <CloseIconNoBorders className="size-10" />
              </DialogClose>
            )}

            {/* TODO: ADD MULTIPLE VARIANTS FOR THIS DIV'S BORDER COLOR AND BACKGROUND COLOR OF THE FIGURE INSIDE IT. */}
            {/* VARIANTS: SUCCESS, ERROR, NEUTRAL, DEFAULT */}
            <div
              className={`${styles.border} w-fit self-center rounded-full border-1 border-solid p-4`}
            >
              <figure
                className={`${styles.background} flex size-50 items-center justify-center rounded-full`}
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

            {!children ? (
              <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex w-full flex-1 items-center"
                >
                  Cancel Action
                </Button>

                {modalActionButton}
              </div>
            ) : (
              children
            )}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
