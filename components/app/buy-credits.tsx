"use client";
import React, { useEffect, useState } from "react";
// import { useCreditsStore } from "@/lib/store/credits-store";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button, ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyCreditsFormSchema } from "@/lib/schemas/form.schemas";
import { BuyCreditsFormSchemaType, RoleType } from "@/types/form.types";
import { createIdempotencyKey, getCreditTiers } from "@/lib/utils/app/utils";
import { CreditTierOption } from "@/types/pricing.types";
import { PURCHASE_TYPES } from "@/lib/config/pricing.config";
import { loadStripe } from "@stripe/stripe-js";
import { CreditBalance } from "@/components/app/credit-balance";
import { toast } from "@/lib/hooks/ui/use-toast";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { useGetUserCredits } from "@/lib/hooks/tanstack/queries/use-get-user-credits";
import { useMobileNavState } from "@/lib/store/ui/mobile-nav-state-store";
import { useUserStore } from "@/lib/store/user/user-store";
import { LoaderIcon } from "@/public/icons/loader-icon";
import { useGetUserPublic } from "@/lib/hooks/tanstack/queries/use-get-user-public";
import { v4 as uuidv4 } from "uuid";

type BuyCreditProps = {
  variant?: ButtonProps["variant"];
  disabled?: boolean;
  showBalance?: boolean;
  isClickable?: boolean;
};

// TODO: CREATE A MODAL TO SHOW A SUCCESSFUL CREDIT PURCHASE
export default function BuyCredits({
  variant = "default",
  disabled,
  showBalance,
  isClickable,
}: BuyCreditProps) {
  const { userId, userRoleId } = useUserStore();

  const newUserRoleId = userRoleId
    ? (`${userRoleId}` as "1" | "2" | "3")
    : undefined;

  const [selectedTier, setSelectedTier] = useState<CreditTierOption>();
  const [promoCode, setPromoCode] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: user } = useGetUserPublic(userId ?? undefined);
  const { setIsMobileNavOpen } = useMobileNavState();

  const userEmail = user?.email;
  const userName = user?.full_name;

  const { data: creditRecord } = useGetUserCredits(
    userId || undefined,
    userRoleId,
  );

  const creditAmount = creditRecord?.remaining_credits;

  const creditTiers = getCreditTiers() as CreditTierOption[];

  const form = useForm<BuyCreditsFormSchemaType>({
    resolver: zodResolver(buyCreditsFormSchema),
    defaultValues: {
      purchaseType: PURCHASE_TYPES.LANDLORD_CREDITS.type,
      priceId: "",
      promoCode: "",
      userId: userId ?? undefined,
      userEmail,
      userName: userName ?? undefined,
      userRoleId: newUserRoleId,
    },
  });

  const {
    formState: { isSubmitting },
    watch,
  } = form;

  const formValues = watch();

  useEffect(() => {
    form.reset({
      purchaseType: PURCHASE_TYPES.LANDLORD_CREDITS.type,
      userId: userId ?? undefined,
      userEmail: userEmail,
      userName: userName ?? undefined,
      userRoleId: newUserRoleId,
    });
  }, [user]);

  async function handleCreditCheckout(values: BuyCreditsFormSchemaType) {
    const priceId = values.priceId;
    const promoCode = values.promoCode;
    const purchaseType = values.purchaseType;
    const userRoleId = values.userRoleId as RoleType;
    const userId = values.userId;
    const userEmail = values.userEmail;
    const userName = values.userName;

    const creditTier = getCreditTiers(priceId) as CreditTierOption;
    const landLordCreditCount = +creditTier?.value;

    try {
      const transactionId = uuidv4();
      const idempotencyKey = createIdempotencyKey(
        "checkout",
        userId!,
        "landlord_credits",
        transactionId,
      );

      const requestBody = {
        purchaseType,
        priceId,
        promoCode,
        landLordCreditCount,
        userId,
        userEmail,
        userName,
        userRoleId,
        idempotencyKey,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
        );

        const stripeError = await stripe?.redirectToCheckout({
          sessionId,
        });

        if (stripeError?.error) {
          throw new Error(`Stripe error: ${stripeError.error}`);
        }
        return;
      } else {
        const responseObj: { error: string } = await response.json();
        toast({
          variant: "destructive",
          description: responseObj.error,
        });
        throw new Error(
          "There was an error trying to process checkout, please try again:",
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (formValues.priceId) {
      const tierOption = creditTiers?.find(
        (tier) => tier?.priceId === formValues.priceId,
      );
      if (tierOption?.priceId !== selectedTier?.priceId) {
        setSelectedTier(tierOption);
      }
    }
  }, [formValues.priceId]);

  const closeAction = () => {
    setIsMobileNavOpen(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {showBalance ? (
          <CreditBalance
            isClickable={isClickable}
            disabled={disabled}
            creditAmount={creditAmount}
            className="hidden lg:flex lg:items-center lg:gap-2"
          />
        ) : (
          <Button
            variant={variant}
            disabled={disabled}
            className="h-full w-full px-6 py-3 text-base"
          >
            Buy Credits
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="h-full w-full rounded-none">
        <section className="max-w-screen-max-xl mx-auto flex w-full flex-col">
          <section className="bg-background border-border sticky top-0 flex items-center justify-between border-b-1">
            <DialogHeader className="p-4 pt-6 sm:px-12 sm:pt-10 lg:px-6">
              <DialogTitle className="text-start text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
                Buy Credits
              </DialogTitle>
              <DialogDescription className="text-text-secondary text-start text-sm leading-6">
                Get credits to boost listings and connect with tenants!
              </DialogDescription>
            </DialogHeader>
            <DialogClose
              onClick={closeAction}
              className="hover:bg-background-secondary flex items-center justify-center p-0"
            >
              <CloseIconNoBorders className="size-10" />
            </DialogClose>
          </section>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreditCheckout)}
              className="flex w-full flex-col items-start gap-16 px-4 pt-6 sm:px-12 lg:px-6"
            >
              <div className="flex w-full max-w-96 flex-col gap-6">
                {/* AVAILABLE CREDITS */}
                <section className="flex w-full flex-col gap-1 text-sm leading-6 font-medium">
                  <h3 className="">Your Available Credits</h3>

                  <CreditBalance disabled creditAmount={creditAmount} />
                </section>

                {/* SELECT CREDIT */}
                <FormField
                  name="priceId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-1 text-sm leading-6 font-medium">
                      <FormLabel>Select the amount to buy</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            size="full"
                            className="w-full rounded-sm px-3 py-2 leading-6"
                          >
                            <SelectValue placeholder="Select amount" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="rounded-sm">
                          {creditTiers?.map((plan) => (
                            <SelectItem
                              className=""
                              key={plan.label}
                              value={plan.priceId}
                            >
                              {plan.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PROMO CODE */}
                <FormField
                  name="promoCode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-1 text-sm leading-6 font-medium">
                      <FormLabel>Promo Code</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          className="p-3"
                          placeholder="Enter code"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* NEW CREDIT BALANCE */}
                <section className="flex w-full flex-col gap-1 text-sm leading-6 font-medium">
                  <h3 className=""> Your new Credits balance will be</h3>

                  <CreditBalance
                    creditAmount={creditAmount}
                    increment={selectedTier ? +selectedTier.value : 0}
                  />
                </section>
              </div>

              <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row md:max-w-104">
                {/* <DialogClose className="sm:w-50"> */}
                <Button
                  type="button"
                  onClick={closeAction}
                  disabled={isSubmitting}
                  variant="outline"
                  className="flex w-full items-center md:w-50"
                >
                  Back
                </Button>
                {/* </DialogClose> */}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center md:w-50"
                >
                  {isSubmitting && (
                    <LoaderIcon className="size-4 animate-spin" />
                  )}
                  {isSubmitting ? "Processing..." : "Buy Credits"}
                </Button>
              </div>
            </form>
          </Form>
        </section>
      </DialogContent>
    </Dialog>
  );
}
