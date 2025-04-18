"use client";
import { Header } from "@/components/app/header";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useModal } from "@/hooks/use-modal";
// import ListingActionModal from "@/components/app/listing-action-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyCreditsFormSchema } from "@/lib/form.schemas";
import { BuyCreditsFormSchemaType } from "@/lib/form.types";
import { getCreditTiers } from "@/lib/utils";
import { CreditTierOption } from "@/lib/pricing.types";
import { Loader2 } from "lucide-react";
import { PURCHASE_TYPES } from "@/lib/pricing.config";
import { loadStripe } from "@stripe/stripe-js";
import { CreditBalance } from "@/components/app/credit-balance";
import { useUser } from "@/hooks/use-user";

// TODO: CREATE A MODAL TO SHOW A SUCCESSFUL CREDIT PURCHASE

export default function Page() {
  // const { credits } = useCreditsStore();
  const [selectedTier, setSelectedTier] = useState<CreditTierOption>();
  const [promoCode, setPromoCode] = useState("");
  const { data: user } = useUser();

  const creditTiers = getCreditTiers() as CreditTierOption[];

  // TODO: CONSIDER THIS AS A SERVER ACTION TO ALLOW USING MUTATIONS
  // ...MIGHT NOT HAVE TO MAKE THIS A MUTATION BECAUSE IT TRIGGERS A RELOAD WHICH RE-FETCHES THE USER CREDIT DATA
  // TODO: - EDGE CASE, NEGATIVE VALUES FOR CREDITS
  async function handleCreditCheckout(values: BuyCreditsFormSchemaType) {
    const priceId = values.creditPriceID;
    const promoCode = values.promoCode;
    const purchaseType = PURCHASE_TYPES.LANDLORD_CREDITS.type;
    const creditTier = getCreditTiers(priceId) as CreditTierOption;
    const creditAmount = creditTier?.value;
    const userId = user?.id;

    try {
      const requestBody = {
        purchaseType,
        priceId,
        promoCode,
        creditAmount,
        userId,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log(response);
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
        throw new Error(
          "There was an error trying to process checkout, please try again:",
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  const form = useForm<BuyCreditsFormSchemaType>({
    resolver: zodResolver(buyCreditsFormSchema),
    defaultValues: {
      creditPriceID: "",
      promoCode: "",
    },
  });

  const {
    formState: { isSubmitting },
    watch,
  } = form;

  const formValues = watch();

  useEffect(() => {
    if (formValues.creditPriceID) {
      const tierOption = creditTiers?.find(
        (tier) => tier?.priceId === formValues.creditPriceID,
      );
      if (tierOption?.priceId !== selectedTier?.priceId) {
        setSelectedTier(tierOption);
      }
    }
  }, [formValues.creditPriceID]);

  return (
    <section className="max-w-screen-max-xl mx-auto">
      <Header
        title="Buy Credits"
        subTitle="Get credits to boost listings and connect with tenants!"
        showButton={false}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreditCheckout)}
          className="flex w-full max-w-96 flex-col items-start gap-16 px-4 pt-6 sm:px-12 lg:px-6"
        >
          <div className="flex w-full flex-col gap-6">
            {/* AVAILABLE CREDITS */}
            <section className="flex w-full flex-col gap-1 text-sm leading-6 font-medium">
              <h3 className="">Your Available Credits</h3>

              <CreditBalance userId={user?.id} />
            </section>

            {/* SELECT CREDIT */}
            <FormField
              name="creditPriceID"
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
                userId={user?.id}
                increment={selectedTier ? +selectedTier.value : 0}
              />
            </section>
          </div>

          <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row md:max-w-104">
            <Button
              type="button"
              disabled={isSubmitting}
              variant="outline"
              className="w-full sm:w-50"
            >
              Back
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center sm:w-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Processing..." : "Buy Credits"}
            </Button>
          </div>
        </form>
      </Form>

      {/* <ListingActionModal
        isOpen={modalData.open}
        onClose={closeModal}
        variant={modalData.variant}
        title={modalData.title}
        message={modalData.message}
        primaryButtonText={modalData.primaryButtonText}
        secondaryButtonText={modalData.secondaryButtonText}
        onPrimaryAction={modalData.onPrimaryAction}
        onSecondaryAction={modalData.onSecondaryAction}
      /> */}
    </section>
  );
}
