"use client";
import { PRICING } from "@/lib/pricing.config";
import { formatCurrencyToLocale } from "@/lib/utils";

import { Header } from "@/components/app/header";
import { PlansCard } from "@/components/app/plans-card";
import { useGetActiveSubscription } from "@/hooks/tanstack/use-get-active-subscription";
import { useUserStore } from "@/lib/store/user-store";
import { ModalProps } from "@/lib/prop.types";
import Modal from "../modal";
import { SadFaceIcon } from "@/public/icons/sad-face-icon";
import { useSwitchToBasicModalStore } from "@/lib/store/switch-to-basic-modal-store";
import { SwitchToBasicBtn } from "../action-buttons";

type LandlordPlansType = {
  name: string;
  price: string;
  status: boolean;
  features: string[];
};

export default function PlansPageBody() {
  const { userId, userRoleId } = useUserStore();
  const { isSwitchToBasicModalOpen, setIsSwitchToBasicModalOpen } =
    useSwitchToBasicModalStore();

  const { data: userActiveSubscription } = useGetActiveSubscription(
    userId || undefined,
    userRoleId,
  );

  const landlordPremiumMonthly = PRICING.landlord.premium.monthly;
  const landlordPremiumPrice = formatCurrencyToLocale(
    landlordPremiumMonthly.amount,
  );
  const landlordPremiumInterval = landlordPremiumMonthly.interval;

  const subscriptionStatus: SubscriptionStatus | undefined =
    userActiveSubscription?.status;
  const isActive = subscriptionStatus === "active" ? true : false;

  const landlordPlans: LandlordPlansType[] = [
    {
      name: "basic",
      price: "free",
      status: !isActive,
      features: PRICING.landlord.basic.features,
    },
    {
      name: "premium",
      price: `${landlordPremiumPrice}/${landlordPremiumInterval}`,
      status: isActive,
      features: PRICING.landlord.premium.monthly?.features,
    },
  ];

  const switchToBasicModalProps: ModalProps = {
    variant: "error",
    title: "Switch to Basic Plan",
    description:
      "You are about to switch your account back to a basic plan, are you sure you want to continue?",
    modalImage: <SadFaceIcon />,
    open: isSwitchToBasicModalOpen,
    setOpen: setIsSwitchToBasicModalOpen,
    modalActionButton: <SwitchToBasicBtn userId={userId} />,
  };

  return (
    <section className="mx-auto max-w-screen-2xl">
      <Header
        title="Plans"
        subTitle="Switch between plans whenever you want."
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center gap-6 px-4 py-6 lg:flex-row 2xl:p-12">
        {landlordPlans.map((plan) => {
          return <PlansCard key={plan.name} plan={plan} />;
        })}
      </div>
      <Modal {...switchToBasicModalProps} />;
    </section>
  );
}
