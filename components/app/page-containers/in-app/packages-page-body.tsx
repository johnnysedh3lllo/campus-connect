"use client";
import { Header } from "../../header";
import firstPlaceIllustration from "@/public/illustrations/first-place-medal-illustration.png";
import secondPlaceIllustration from "@/public/illustrations/second-place-medal-illustration.png";
import thirdPlaceIllustration from "@/public/illustrations/third-place-medal-illustration.png";
import { PRICING } from "@/lib/config/pricing.config";

import { PackagesCard } from "../../packages-card";

export function PackagesPageBody() {
  const packagesData = [
    {
      tier: "bronze",
      title: "Bronze Package",
      titleTextClass: "text-[#8A4A21]",
      cardClass:
        "bg-[linear-gradient(180deg,_#FFCEAF_-38.26%,_#FFF_46.65%)] lg:min-h-[409px]",
      textClass: "text-text-secondary font-medium",
      image: thirdPlaceIllustration,
    },
    {
      tier: "silver",
      title: "Silver Package",
      titleTextClass: "text-[#786A88] lg:text-4xl",
      cardClass:
        "bg-[linear-gradient(180deg,_#D1BFE4_-38.26%,_#FFF_43.86%)] row-start-1 row-end-2 lg:min-h-[488px]",
      textClass: "text-text-primary font-semibold",
      image: secondPlaceIllustration,
    },
    {
      tier: "gold",
      title: "Gold Package",
      titleTextClass: "text-[#B16000]",
      cardClass:
        "bg-[linear-gradient(180deg,_#FEC889_-38.26%,_#FFF_46.65%)] lg:min-h-[409px]",
      textClass: "text-text-secondary font-medium",
      image: firstPlaceIllustration,
    },
  ];

  const newPackagesData = Object.values(PRICING.student).map((pkg) => {
    const packageData = packagesData.find(
      (pkgData) => pkgData.tier == pkg.tier,
    );
    return {
      ...packageData,
      ...pkg,
    };
  });

  return (
    <section className="mx-auto max-w-screen-2xl">
      <Header
        title="Upgrade Packages"
        subTitle="Purchase packages whenever you want."
      />

      <section className="flex flex-col gap-6 px-4 py-6 sm:gap-12 sm:px-10 lg:gap-14">
        <section className="mx-auto flex max-w-xl flex-col gap-3 text-center">
          <h2 className="text-base leading-6 font-semibold text-black">
            Our Packages
          </h2>
          <p className="text-sm leading-6 text-gray-900">
            With these packages, Campus Connect ensures a hassle-free experience
            in finding the perfect off-campus housing for you.
          </p>
        </section>

        <section className="lg max-w-screen-max-xl mx-auto grid grid-cols-1 gap-6 lg:flex lg:flex-row lg:items-center lg:gap-x-6 lg:gap-y-0">
          {newPackagesData.map((pkg, index) => {
            return <PackagesCard key={index} pkg={pkg} />;
          })}
        </section>
      </section>
    </section>
  );
}
