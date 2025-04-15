"use client";
import { Header } from "@/components/app/header";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCreditsStore } from "@/lib/store/credits-store";
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
import { useModal } from "@/hooks/use-modal";
import ListingActionModal from "@/components/app/listing-action-modal";
import { CreditChipIcon } from "@/public/icons/credit-chip-icon";

function page() {
  const router = useRouter();
  const { credits } = useCreditsStore();
  const [selectedPlan, setSelectedPlan] = useState<{
    label: string;
    value: number;
    price: number;
  } | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const { modalData, openModal } = useModal();

  function handleEscape() {
    router.push("/listings");
  }

  function handleApplyPromo() {
    console.log("Applying promo code:", promoCode);
  }

  const plans = [
    { id: 1, label: "10 Credits - $10", value: 10, price: 10 },
    { id: 2, label: "20 Credits - $18", value: 20, price: 18 },
    { id: 3, label: "50 Credits - $40", value: 50, price: 40 },
  ];

  function onSubmit(data: { plan: string }) {
    const chosenPlan = plans.find((plan) => plan.label === data.plan);
    setSelectedPlan(chosenPlan || null);
    openModal({
      variant: "success",
      message:
        "Your credits have been added to your account. Start listing your property and connect with tenants now! 🚀",
      title: "Purchase Successful!",
      primaryButtonText: "Back To Listings",
    });
    console.log("Selected Plan:", chosenPlan);
  }
  function closeModal() {
    router.push("/listings");
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ plan: string }>({
    defaultValues: { plan: "" },
  });
  return (
    <section>
      <Header
        title="Buy Credits"
        subTitle="Get credits to boost listings and connect with tenants!"
        showButton={false}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-6 px-4 pt-12 pb-3 sm:px-12 md:mx-20 md:px-0"
      >
        <div className="w-full">
          <h3 className="text-sm leading-6 font-medium">
            Your Available Credits
          </h3>
          <div className="flex items-center gap-2">
            <CreditChipIcon />
            <p className="text-sm leading-6 font-medium">{credits} Credits</p>
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium">
            Select the amount to buy
          </label>
          <Controller
            name="plan"
            control={control}
            rules={{ required: "Please select a plan" }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Find and set the selected plan when the dropdown changes
                  const chosenPlan = plans.find((plan) => plan.label === value);
                  setSelectedPlan(chosenPlan || null);
                }}
                value={field.value}
              >
                <SelectTrigger className="w-full rounded-sm md:max-w-98">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.label}>
                      {plan.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.plan && (
            <p className="mt-1 text-sm text-red-500">{errors.plan.message}</p>
          )}
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium">Promo Code</label>
          <div className="grid w-full grid-cols-[3fr_0.5fr] gap-2 md:max-w-98">
            <Input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="h-full rounded-sm"
            />
            <Button type="button" onClick={handleApplyPromo} variant="outline">
              Apply
            </Button>
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-sm leading-6 font-medium">
            Your new Credits balance will be
          </h3>
          <div className="flex items-center gap-2">
            <CreditChipIcon />
            <p className="text-sm leading-6 font-medium">
              {selectedPlan ? credits + selectedPlan.value : credits} Credits
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row md:max-w-104">
          <Button type="button" variant={"outline"} className="w-full sm:w-50">
            Back
          </Button>
          <Button type="submit" className="w-full sm:w-50">
            Buy Credits
          </Button>
        </div>
      </form>
      <ListingActionModal
        isOpen={modalData.open}
        onClose={closeModal}
        variant={modalData.variant}
        title={modalData.title}
        message={modalData.message}
        primaryButtonText={modalData.primaryButtonText}
        secondaryButtonText={modalData.secondaryButtonText}
        onPrimaryAction={modalData.onPrimaryAction}
        onSecondaryAction={modalData.onSecondaryAction}
      />
    </section>
  );
}

export default page;
