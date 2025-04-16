"use client";
import { Header } from "@/components/app/header";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { useCreditsStore } from "@/lib/store/credits-store";
import { useForm, Controller } from "react-hook-form";
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
import { CreditChipIcon } from "@/public/icons/credit-chip-icon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buyCreditsFormSchema } from "@/lib/form.schemas";
import { BuyCreditsFormSchemaType } from "@/lib/form.types";

export default function Page() {
  const router = useRouter();
  // const { credits } = useCreditsStore();
  const credits = 150;
  const [selectedPlan, setSelectedPlan] = useState<{
    label: string;
    value: number;
    price: number;
  } | null>(null);
  const [promoCode, setPromoCode] = useState("");
  // const { modalData, openModal } = useModal();

  // function handleEscape() {
  //   router.push("/listings");
  // }

  function handleApplyPromo() {
    console.log("Applying promo code:", promoCode);
  }

  const plans = [
    { id: 1, label: "10 Credits - $10", value: "10", price: 10 },
    { id: 2, label: "20 Credits - $18", value: "20", price: 18 },
    { id: 3, label: "50 Credits - $40", value: "50", price: 40 },
  ];

  function onSubmit(values: BuyCreditsFormSchemaType) {
    console.log(values);
  }

  const form = useForm<BuyCreditsFormSchemaType>({
    resolver: zodResolver(buyCreditsFormSchema),
    defaultValues: {
      creditAmount: "",
      promoCode: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  return (
    <section className="max-w-screen-max-xl mx-auto">
      <Header
        title="Buy Credits"
        subTitle="Get credits to boost listings and connect with tenants!"
        showButton={false}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-96 flex-col items-start gap-16 px-4 pt-6 sm:px-12 lg:px-6"
        >
          <div className="flex w-full flex-col gap-6">
            {/* AVAILABLE CREDITS */}
            <section className="flex w-full flex-col gap-1 text-sm leading-6 font-medium">
              <h3 className="">Your Available Credits</h3>
              <div className="flex items-center gap-2">
                <CreditChipIcon />
                <p className="">{credits} Credits</p>
              </div>
            </section>

            {/* SELECT CREDIT */}
            <FormField
              name="creditAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-1 text-sm leading-6 font-medium">
                  <FormLabel>Select the amount to buy</FormLabel>
                  <Select
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
                      {plans.map((plan) => (
                        <SelectItem
                          className=""
                          key={plan.id}
                          value={plan.value}
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
              <div className="flex items-center gap-2">
                <CreditChipIcon />
                <p className="">
                  {selectedPlan ? credits + selectedPlan.value : credits}{" "}
                  Credits
                </p>
              </div>
            </section>
          </div>

          <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row md:max-w-104">
            <Button type="button" variant="outline" className="w-full sm:w-50">
              Back
            </Button>
            <Button type="submit" className="w-full sm:w-50">
              Buy Credits
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
