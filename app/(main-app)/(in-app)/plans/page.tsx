import { Header } from "@/components/app/header";
import { PlansCard } from "@/components/app/plans-card";
import { PLANS, PRICING } from "@/lib/pricing.config";
import { formatCurrency } from "@/lib/utils";
// import { useState } from "react";

export default function Page() {
  // const [isLandlordPremium, setIsLandlordPremium] = useState<Boolean>(false)

  const isPremium = false;

  const landlordPremiumMonthly = PRICING.landlord.premium.monthly;
  const landlordPremiumPrice = formatCurrency(landlordPremiumMonthly.amount);
  const landlordPremiumInterval = landlordPremiumMonthly.interval;

  return (
    <section className="mx-auto max-w-screen-2xl">
      <Header
        title="Plans"
        subTitle="Switch between plans whenever you want."
        showButton={false}
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center gap-6 px-4 py-6 2xl:p-12 lg:flex-row">
        <PlansCard
          isPremium={isPremium}
          plan="Basic"
          price="Free"
          planFeatures={PLANS.landlord.basic}
        />

        <PlansCard
          isPremium={!isPremium}
          plan="Premium"
          price={`${landlordPremiumPrice}/${landlordPremiumInterval}`}
          planFeatures={PLANS.landlord.premium}
        />
      </div>
    </section>
  );
}
