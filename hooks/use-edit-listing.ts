import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { CREDITS_REQUIRED_TO_CREATE_LISTING } from "@/lib/constants";
import { updateListing } from "@/app/actions/supabase/listings";

export function useEditListing({
  homeDetails,
  pricing,
  photos,
  isPremium,
  isLoadingPremium,
  errorGettingPremium,
  credits,
  openModal,
  closeModal,
  setPremium,
  clearData,
  listingId,
}: {
  homeDetails:
    | {
        title: string;
        description: string;
        noOfBedRooms: string;
        listingType: ListingType;
        location: string;
      }
    | undefined;
  pricing:
    | {
        price: number;
        paymentFrequency: ListingPaymentFrequency;
      }
    | undefined;
  photos: File[] | undefined;
  isPremium: boolean | null;
  isLoadingPremium: boolean;
  errorGettingPremium: string | null;
  credits:
    | {
        created_at: string | null;
        remaining_credits: number | null;
        total_credits: number;
        updated_at: string | null;
        used_credits: number | null;
        user_id: string;
      }
    | null
    | undefined;
  openModal: (
    data: Partial<{
      open: boolean;
      variant: "success" | "error" | "warning";
      title?: string;
      message?: string;
      primaryButtonText?: string;
      secondaryButtonText?: string;
      onPrimaryAction?: () => void;
      onSecondaryAction?: () => void;
      icon?: React.ReactNode;
    }>,
  ) => void;
  closeModal: () => void;
  setPremium: () => void;
  clearData: () => void;
  listingId: string;
}) {
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleEditListing() {
    setIsPublishing(true);
    try {
      if (!homeDetails || Object.keys(homeDetails).length === 0) {
        throw new Error("Home details are missing");
      }
      if (!pricing || !pricing.price) {
        throw new Error("Pricing information is required");
      }
      if (!photos || photos.length === 0) {
        throw new Error("At least one photo is required");
      }
      if (isLoadingPremium) {
        toast({
          title: "Loading Premium Status",
          description: "Please wait while we verify your premium status.",
          variant: "destructive",
        });
        return;
      }
      if (errorGettingPremium) {
        toast({
          title: "Error Checking Premium Status",
          description:
            "Unable to verify your premium status. Please try again.",
          variant: "destructive",
        });
        return;
      }
      if (
        !isPremium &&
        (credits?.remaining_credits == null ||
          credits.remaining_credits < CREDITS_REQUIRED_TO_CREATE_LISTING)
      ) {
        openModal({
          variant: "error",
          title: "Insufficient Credits or Premium Status",
          message:
            "You need to either have enough credits or be a premium user to list this property.",
          primaryButtonText: "Get Premium",
          secondaryButtonText: "Buy Credits",
          onPrimaryAction: () => {
            setPremium();
            closeModal();
          },
          onSecondaryAction: () => router.push("/buy-credits"),
        });
        return;
      }
      const formData = { homeDetails, pricing, photos };
      const data = await updateListing(listingId, formData);
      if (!data.success) {
        openModal({
          variant: "error",
          title: "Error Publishing Listing",
          message:
            data.message || "Failed to publish listing. Please try again.",
          primaryButtonText: "Try Again",
        });
        return;
      }
      if (!isPremium) {
        // TODO: Add function that Deducts credits from user balance
      }
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      openModal({
        variant: "success",
        title: "Property listed successfully",
        message: isPremium
          ? "Your property has been listed successfully as a premium user."
          : `${CREDITS_REQUIRED_TO_CREATE_LISTING} credits have been deducted from your balance.`,
        primaryButtonText: "Back to listings",
        onPrimaryAction: () => {
          router.push("/listings");
          clearData();
        },
      });
    } catch (error: any) {
      console.log("Error Publishing Listing :", error);
      toast({
        title: "Error Publishing Listing",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      openModal({
        variant: "error",
        title: "Error Publishing Listing",
        message:
          error.message || "An unexpected error occurred. Please try again.",
        primaryButtonText: "Try Again",
      });
    } finally {
      setIsPublishing(false);
    }
  }

  return { isPublishing, handleEditListing };
}
