"use client";
import { PLANS, PRICING, PURCHASE_TYPES } from "@/lib/pricing.config";
import { formatCurrency } from "@/lib/utils";

import { Header } from "@/components/app/header";
import { PlansCard } from "@/components/app/plans-card";

type LandlordPlansType = {
  name: string;
  price: string;
  status: boolean;
  features: string[];
};

export default function Page() {
  const landlordPremiumMonthly = PRICING.landlord.premium.monthly;
  const landlordPremiumPrice = formatCurrency(landlordPremiumMonthly.amount);
  const landlordPremiumInterval = landlordPremiumMonthly.interval;

  const fromDb: SubscriptionStatus = null;
  const isActive = fromDb === "active" ? true : false;

  const landlordPlans: LandlordPlansType[] = [
    {
      name: "basic",
      price: "free",
      status: !isActive,
      features: PLANS.landlord.basic,
    },
    {
      name: "premium",
      price: `${landlordPremiumPrice}/${landlordPremiumInterval}`,
      status: isActive,
      features: PLANS.landlord.premium,
    },
  ];

  return (
    <section className="mx-auto max-w-screen-2xl">
      <Header
        title="Plans"
        subTitle="Switch between plans whenever you want."
        showButton={false}
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center gap-6 px-4 py-6 lg:flex-row 2xl:p-12">
        {landlordPlans.map((plan) => {
          return (
            <PlansCard
              key={plan.name}
              status={plan.status}
              name={plan.name}
              price={plan.price}
              features={plan.features}
            />
          );
        })}
      </div>
    </section>
  );
}
