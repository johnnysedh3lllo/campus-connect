"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

import { Button } from "../../ui/button";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";
import { SuccessShieldIcon } from "@/public/icons/success-shield-icon";
import { useUserStore } from "@/lib/store/user-store";
import { RoleGate } from "../role-gate";
import { VerifySessionResponseType } from "@/app/api/verify-session/route";
import Modal from "./modal";

export const verifyPaymentStatus = async (sessionId: string) => {
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

export function PaymentAlertModal() {
  const { userRoleId } = useUserStore();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [studentPackage, setStudentPackage] = useState<string | null>(null);
  const [modalId, setModalId] = useState<string | null>(null);

  useEffect(() => {
    const currentModalId = searchParams.get("modalId");
    const currentSessionId = searchParams.get("session_id");

    if (!currentModalId || !currentSessionId) return;

    setModalId(currentModalId);

    verifyPaymentStatus(currentSessionId).then((result) => {
      if (result?.ok) {
        console.log(result);
        if (
          currentModalId === "land_premium_success" &&
          result.subscriptionData
        ) {
          const date = result.subscriptionData.current_period_end;
          setFormattedDate(format(date, "MMM do yyyy"));
        }
        if (currentModalId === "stud_package_success" && result) {
          const packageName = result.sessionMetadata?.studentPackageName;
          setStudentPackage(packageName);
        }

        setOpen(true);
      }
    });
  }, [searchParams]);

  let modalDescription;

  modalId === "land_premium_success" && formattedDate
    ? (modalDescription = (
        <>
          Your current plan will be renewed on
          <span className="text-primary">{formattedDate}</span>. You can start
          enjoying your Campus Connect premium.
        </>
      ))
    : "You can start enjoying your Campus Connect premium.";

  modalId === "stud_package_success"
    ? (modalDescription = (
        <>
          You can start enjoying your Campus Connect{" "}
          <span className="text-text-primary capitalize">{studentPackage}</span>{" "}
          package
        </>
      ))
    : "You can start enjoying your Campus Connect package";

  return (
    <>
      <RoleGate userRoleId={userRoleId} role="LANDLORD">
        {modalId === "land_premium_success" && (
          <Modal
            variant="success"
            modalId="land_premium_success"
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
                className="h-full w-full cursor-pointer gap-3 px-7.5 py-3 text-base leading-6 sm:flex"
              >
                <p>Back to listings</p>
                <ChevronRightIcon />
              </Button>
            </Link>
          </Modal>
        )}
        {modalId === "land_credit_success" && (
          <Modal
            variant="success"
            modalId="land_credit_success"
            open={open}
            setOpen={setOpen}
            clearParamAfterOpen
            title="Purchase Successful"
            description="Your credits have been added to your account. Start listing your properties and connect with tenants now!🚀"
            modalImage={<SuccessShieldIcon />}
          >
            <Link href="/listings" className="w-full">
              <Button
                onClick={() => setOpen(false)}
                className="h-full w-full cursor-pointer gap-3 px-7.5 py-3 text-base leading-6 sm:flex"
              >
                <p>Back to listings</p>
                <ChevronRightIcon />
              </Button>
            </Link>
          </Modal>
        )}
      </RoleGate>

      <RoleGate userRoleId={userRoleId} role="TENANT">
        {modalId === "stud_package_success" && (
          <Modal
            variant="success"
            modalId="stud_package_success"
            open={open}
            setOpen={setOpen}
            clearParamAfterOpen
            title="Payment Successful"
            description={modalDescription}
            modalImage={<SuccessShieldIcon />}
          >
            <Link href="/messages" className="w-full">
              <Button
                onClick={() => setOpen(false)}
                className="h-full w-full cursor-pointer gap-3 px-7.5 py-3 text-base leading-6 sm:flex"
              >
                Done
              </Button>
            </Link>
          </Modal>
        )}
      </RoleGate>
    </>
  );
}
