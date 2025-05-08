"use client";
import { CheckIcon } from "@/public/icons/check-icon";
import { Button } from "../ui/button";
import { PlansCardProps } from "@/lib/prop.types";
import { useGetUser } from "@/hooks/tanstack/use-get-user";
import { useSwitchToBasicModalStore } from "@/lib/store/switch-to-basic-modal-store";
import { SubscribeToPremiumBtn } from "./action-buttons";

export function PlansCard({ plan }: PlansCardProps) {
  const { setIsSwitchToBasicModalOpen } = useSwitchToBasicModalStore();
  const { data: user } = useGetUser();

  const { name, price, status, features } = plan;

  return (
    <section
      className={`${status ? "bg-background-accent text-white" : "text-text-accent bg-background"} border-line flex w-full flex-col gap-6 rounded-md border p-6`}
    >
      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-2 lg:gap-3">
          <h2 className="text-2xl leading-8 font-semibold capitalize">
            {name}
          </h2>
          <p className="text-sm leading-6 font-medium capitalize">{price}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm leading-6">Includes:</h3>

          <ul className="flex flex-col gap-4">
            {features.map((feature, index) => {
              return (
                <li key={index} className="flex items-start gap-1">
                  <CheckIcon className="" />
                  <p className="text-sm leading-6 font-semibold">{feature}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {status ? (
        <span className="bg-primary text-text-inverse w-fit rounded-sm px-11 py-3 text-base leading-6 font-semibold">
          This is your current plan
        </span>
      ) : (
        <>
          {name === "basic" ? (
            <Button
              onClick={() => setIsSwitchToBasicModalOpen(true)}
              className="h-full w-full px-11 py-3 text-base leading-6 sm:w-fit"
            >
              Switch to Basic
            </Button>
          ) : name === "premium" ? (
            <SubscribeToPremiumBtn user={user} />
          ) : null}
        </>
      )}
    </section>
  );
}
