"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { cn, formatUsersName } from "@/lib/utils";
import { User } from "@supabase/supabase-js";

import { PRICING, PURCHASE_TYPES } from "@/lib/config/pricing.config";
import {
  PurchasePremiumFormType,
  UserValidationType,
} from "@/types/form.types";
import { purchasePremiumFormSchema } from "@/lib/form.schemas";

import { ConversationFormType } from "@/types/form.types";
import { useUpdateConversationParticipants } from "@/hooks/tanstack/mutations/use-update-conversation-participants";
import { PlusIcon } from "@/public/icons/plus-icon";
import Link from "next/link";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { useUpdateListing } from "@/hooks/tanstack/mutations/use-update-listing";
import { statusVerbMap } from "@/lib/config/app.config";
import { LeftChevonIcon } from "@/public/icons/left-chevon-icon";
import { useDeleteListing } from "@/hooks/tanstack/mutations/use-delete-listing";
import { useBackToLastPage } from "@/hooks/use-back-to-last-page";
import { useUserStore } from "@/lib/store/user-store";
import { useCreateConversation } from "@/hooks/tanstack/mutations/use-create-conversation";
import { useGetPackageRecord } from "@/hooks/tanstack/use-get-package-record";
import { BadgeIcon } from "@/public/illustrations/badge-icon";
import { ModalProps } from "@/types/prop.types";
import Modal from "./modals/modal";
import { Skeleton } from "../ui/skeleton";

const publishableKey: string | undefined =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// LISTINGS
export function CreateListingsButton() {
  return (
    <Link href="/listings/create">
      <Button className="hidden h-full cursor-pointer gap-3 px-7.5 py-3 text-base leading-6 sm:flex">
        <p>Create a listing</p>
        {<PlusIcon />}
      </Button>
    </Link>
  );
}

export function CancelListingButton() {
  return (
    <Button className="hidden h-full cursor-pointer gap-3 px-7.5 py-3 text-base leading-6 sm:flex">
      <CloseIconNoBorders className="size-10" />;
    </Button>
  );
}

export function ChangeListingPubStatusButton({
  userId,
  listingUUID,
  publicationStatus,
  setIsPublishStatusModalOpen,
}: {
  userId: string | null;
  listingUUID: string;
  publicationStatus: ListingPublicationStatus | undefined;
  setIsPublishStatusModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const updateListing = useUpdateListing();

  const handleStatusChange = async () => {
    try {
      setIsLoading(true);
      const updatedListing = await updateListing.mutateAsync({
        userId: userId,
        listingUUID: listingUUID,
        listingData: {
          publication_status: publicationStatus,
        },
      });

      if (!updateListing.isError) {
        setIsPublishStatusModalOpen(false);
        toast({
          variant: "info",
          description: `This listing is now  ${updatedListing?.data?.publication_status}.`,
        });
      } else {
        throw updatedListing.error;
      }

      console.log(updatedListing);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      className="w-full flex-1 capitalize"
      onClick={handleStatusChange}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {isLoading
        ? "Loading..."
        : publicationStatus && statusVerbMap[publicationStatus]}
    </Button>
  );
}

export function DeleteListingButton({
  userId,
  listingUUID,
  publicationStatus,
  setIsDeleteListingModalOpen,
  imagePaths,
}: {
  userId: string | null;
  listingUUID: string;
  publicationStatus: ListingPublicationStatus | undefined;
  setIsDeleteListingModalOpen: Dispatch<SetStateAction<boolean>>;
  imagePaths: string[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const deleteListing = useDeleteListing();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const deletedListing = await deleteListing.mutateAsync({
        userId: userId,
        listingUUID: listingUUID,
        publicationStatus: publicationStatus,
        imagePaths,
      });

      if (!deleteListing.isError) {
        setIsDeleteListingModalOpen(false);
        toast({
          variant: "info",
          title: "Property Deleted!",
          description: `You have successfully deleted the "${deletedListing?.data?.title}" property from your listings`,
        });
        router.push("/listings");
      } else {
        throw deletedListing.error;
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      className="w-full flex-1 capitalize"
      onClick={handleDelete}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {isLoading ? "Loading..." : "Delete"}
    </Button>
  );
}

export function MessageLandlordButton({
  landlordId,
}: {
  landlordId: string | undefined;
}) {
  const { userId, userRoleId } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpgradePackageModalOpen, setIsUpgradePackageModalOpen] =
    useState(false);
  const router = useRouter();

  const { data: currentPackage, isLoading: isPackageLoading } =
    useGetPackageRecord(userId || undefined, userRoleId);

  const createConversationMutation = useCreateConversation();

  async function handleMessage() {
    console.log("user id", userId);
    console.log("landlord id", landlordId);

    if (!userId || !landlordId) return;
    setIsLoading(true);

    try {
      const createdConversation = await createConversationMutation.mutateAsync({
        tenantId: userId,
        landlordId: landlordId,
      });

      if (!createConversationMutation.isError) {
        toast({
          variant: "success",
          description: "Success!",
        });

        router.push(`/messages/${createdConversation?.conversation_id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const upgradePackageModalProps: ModalProps = {
    modalId: "stud_listing_landlord_message",
    variant: "error",
    title: "Upgrade your package",
    description:
      "Upgrade your plan and you’ll be able to message landlords anytime you want",
    modalImage: <BadgeIcon />,
    showCloseButton: true,
    open: isUpgradePackageModalOpen,
    setOpen: setIsUpgradePackageModalOpen,
  };

  const hasPackageInquires =
    !currentPackage || (currentPackage?.remaining_inquiries ?? 0) <= 0;

  return (
    <>
      {isPackageLoading ? (
        <Skeleton className="h-12 w-full" />
      ) : !hasPackageInquires ? (
        <Button disabled={isLoading} onClick={handleMessage} className="w-full">
          {isLoading && <Loader2 className="animate-spin" />}
          {isLoading ? "Processing...." : "Message"}
        </Button>
      ) : (
        <Button
          onClick={() => setIsUpgradePackageModalOpen(true)}
          className="w-full"
        >
          Message
        </Button>
      )}

      <Modal {...upgradePackageModalProps}>
        <Link className="w-full" href="/packages">
          <Button className="w-full">View Packages</Button>
        </Link>
      </Modal>
    </>
  );
}

// GENERAL
export function BackButton({
  route,
  className,
}: {
  route: string;
  className?: string;
}) {
  const backToLastPage = useBackToLastPage("/listings");

  return (
    <Button
      onClick={backToLastPage}
      variant="secondary"
      className={cn(
        "hover:bg-background-secondary size-10 items-center justify-center rounded-sm p-0",
        className,
      )}
    >
      <LeftChevonIcon />
    </Button>
  );
}

// PLANS
export function SubscribeToPremiumBtn({
  user,
}: {
  user: User | null | undefined;
}) {
  const userId = user?.id;
  const userRoleId: UserValidationType["roleId"] = user?.user_metadata.role_id;
  const usersName = user?.user_metadata
    ? formatUsersName(user.user_metadata)
    : undefined;
  const userEmail = user?.email;

  const premiumSubscriptionForm = useForm<PurchasePremiumFormType>({
    resolver: zodResolver(purchasePremiumFormSchema),
    defaultValues: {
      purchaseType: PURCHASE_TYPES.LANDLORD_PREMIUM.type,
      priceId: PRICING.landlord.premium.monthly.priceId,
      landlordPremiumPrice: PRICING.landlord.premium.monthly.amount,
      userId,
      userEmail,
      usersName,
      userRoleId,
    },
  });

  const {
    formState: { isSubmitting: isSubmittingPremium },
  } = premiumSubscriptionForm;

  async function handleSubscribeToPremium(values: PurchasePremiumFormType) {
    const { purchaseType, userId, priceId, landlordPremiumPrice, userRoleId } =
      values;

    try {
      const requestBody = {
        purchaseType,
        priceId,
        landlordPremiumPrice,
        userId,
        userEmail,
        usersName,
        userRoleId,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const { sessionId } = await response.json();

        if (!publishableKey) {
          throw new Error("Stripe publishable key not found");
        }
        const stripe = await loadStripe(publishableKey);

        const stripeError = await stripe?.redirectToCheckout({
          sessionId,
        });

        if (stripeError?.error) {
          throw new Error(`Stripe error: ${stripeError.error}`);
        }
      } else {
        const responseObj: { error: string } = await response.json();
        toast({
          variant: "info",
          showCloseButton: false,
          description: responseObj.error,
        });

        throw responseObj;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...premiumSubscriptionForm}>
      <form
        onSubmit={premiumSubscriptionForm.handleSubmit(
          handleSubscribeToPremium,
        )}
      >
        <Button
          type="submit"
          disabled={isSubmittingPremium}
          className="h-full w-full px-11 py-3 text-base leading-6 sm:w-fit"
        >
          {isSubmittingPremium && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmittingPremium ? "Processing..." : "Go Premium"}
        </Button>
      </form>
    </Form>
  );
}

export function SwitchToBasicBtn({ userId }: { userId: string | null }) {
  const [billingPortalUrl, setBillingPortalUrl] = useState<string | null>(null);

  const switchToBasicForm = useForm();
  const {
    formState: { isSubmitting },
  } = switchToBasicForm;

  // TODO: DRY this up in other places, maybe abstract into a file
  async function createPortalSession(
    userId: User["id"] | undefined,
  ): Promise<string> {
    const response = await fetch("/api/billing-portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(
        "There was an error creating the billing portal session.",
      );
    }

    const { url } = await response.json();
    return url;
  }
  // TODO: HANDLE CASE WHERE A USER IS NOT YET A CUSTOMER
  // Preload portal session on mount
  useEffect(() => {
    async function preloadBillingPortal() {
      if (!userId) return;

      try {
        const url = await createPortalSession(userId);
        setBillingPortalUrl(url);
      } catch (error: any) {
        console.error(error);
      }
    }

    preloadBillingPortal();
  }, [userId]);

  async function handleRedirect() {
    try {
      if (!userId) {
        throw new Error(
          "Some necessary details are missing. Please reload and try again later.",
        );
      }

      let url = billingPortalUrl;

      // If not preloaded, fetch on demand
      if (!url) {
        const portalUrl = await createPortalSession(userId);
        url = portalUrl;
        setBillingPortalUrl(url); // cache for future
      }

      window.location.href = url!;
    } catch (error: any) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          description: error.message,
          showCloseButton: false,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
      console.error(error);
    }
  }

  return (
    <Form {...switchToBasicForm}>
      <form
        className="h-full w-full flex-1 border-x-1 border-transparent"
        onSubmit={switchToBasicForm.handleSubmit(handleRedirect)}
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-full w-full px-0 py-3 text-base leading-6"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Processing..." : "Switch to Basic"}
        </Button>
      </form>
    </Form>
  );
}

// MESSAGES
export function DeleteChatBtn({
  user,
  conversationId,
  chatName,
  setIsDeleteModalOpen,
}: {
  user: User | null;
  conversationId: Messages["conversation_id"];
  chatName: string;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const form = useForm<ConversationFormType>({
    defaultValues: {
      userId: user?.id,
      conversationId: conversationId || undefined, // TODO: revisit this and optimize
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  const conversationParticipantsMutation = useUpdateConversationParticipants();

  async function handleChatDeletion(values: ConversationFormType) {
    try {
      const currentDate = new Date().toISOString();
      const result = await conversationParticipantsMutation.mutateAsync({
        conversationData: values,
        conversationParticipantsDetails: {
          deleted_at: currentDate,
          message_cutoff_at: currentDate,
        },
      });

      if (!result.success) {
        throw new Error(result.error?.message);
      }

      console.log(result);
      console.log("you have successfully deleted this chat");

      toast({
        variant: "success",
        showCloseButton: false,
        description: `Your chat with ${chatName} has been deleted!`,
      });

      setIsDeleteModalOpen(false);
      router.push("/messages");
    } catch (error: any) {
      if (error instanceof Error) {
        console.error(error.message);

        toast({
          variant: "destructive",
          title: "Unable to delete chat",
          description: error.message,
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        className="h-full w-full flex-1 border-x-1 border-transparent"
        onSubmit={handleSubmit(handleChatDeletion)}
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex h-full w-full flex-1 items-center px-0"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Deleting..." : "Delete"}
        </Button>
      </form>
    </Form>
  );
}
