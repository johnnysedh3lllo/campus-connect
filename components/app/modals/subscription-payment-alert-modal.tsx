"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

import Modal from "../modal";
import { Button } from "../../ui/button";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";
import { SuccessShieldIcon } from "@/public/icons/success-shield-icon";
import { useUserStore } from "@/lib/store/user-store";
import { RoleGate } from "../role-gate";
import { VerifySessionResponseType } from "@/app/api/verify-session/route";

export const checkPaymentStatus = async (sessionId: string) => {
  try {
    const response = await fetch("/api/verify-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error(
        "❌ Payment verification failed or returned unexpected result.",
      );
    }

    const result: VerifySessionResponseType = await response.json();
    return result;
  } catch (err) {
    console.error("⚠️ Error confirming payment:", err);
  }
};

export function SubscriptionPaymentAlertModal() {
  const { userRoleId } = useUserStore();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const modalId = searchParams.get("modalId");

    if (sessionId && modalId === "payment_success") {
      checkPaymentStatus(sessionId).then((result) => {
        if (result?.ok) {
          const date = result.subscriptionData.current_period_end;
          setFormattedDate(format(date, "MMM do yyyy"));
          setOpen(true);
        }
      });
    }
  }, [searchParams]);

  const modalDescription = formattedDate ? (
    <>
      Your current plan will be renewed on{" "}
      <span className="text-primary">{formattedDate}</span>. You can start
      enjoying your Campus Connect premium.
    </>
  ) : (
    "You can start enjoying your Campus Connect premium."
  );

  return (
    <RoleGate userRoleId={userRoleId} role="LANDLORD">
      <Modal
        variant="success"
        modalId="payment_success"
        open={open}
        setOpen={setOpen}
        clearParamAfterOpen
        title="Payment Successful"
        description={modalDescription}
        modalImage={<SuccessShieldIcon />}
      >
        <Link href="/listings" className="w-full">
          <Button
            onClick={() => setOpen(false)}
            className="hidden h-full w-full cursor-pointer gap-3 px-7.5 py-3 text-base leading-6 sm:flex"
          >
            <p>Back to listings</p>
            <ChevronRightIcon />
          </Button>
        </Link>
      </Modal>
    </RoleGate>
  );
}
