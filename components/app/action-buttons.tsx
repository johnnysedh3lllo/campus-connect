"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "@/lib/hooks/ui/use-toast";
import { ToastAction } from "../ui/toast";
import { cn, createIdempotencyKey } from "@/lib/utils/app/utils";
import { User } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

import { PRICING, PURCHASE_TYPES } from "@/lib/config/pricing.config";

import { ConversationFormType, RoleType } from "@/types/form.types";
import { useUpdateConversationParticipants } from "@/lib/hooks/tanstack/mutations/chat/use-update-conversation-participants";
import { PlusIcon } from "@/public/icons/plus-icon";
import Link from "next/link";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { useUpdateListing } from "@/lib/hooks/tanstack/mutations/listings/use-update-listing";
import { statusVerbMap } from "@/lib/config/app.config";
import { LeftChevonIcon } from "@/public/icons/left-chevon-icon";
import { useDeleteListing } from "@/lib/hooks/tanstack/mutations/listings/use-delete-listing";
import { useBackToLastPage } from "@/lib/hooks/global/use-back-to-last-page";
import { useUserStore } from "@/lib/store/user/user-store";
import { useCreateConversation } from "@/lib/hooks/tanstack/mutations/chat/use-create-conversation";
import { useGetPackageRecord } from "@/lib/hooks/tanstack/queries/use-get-package-record";
import { BadgeIcon } from "@/public/illustrations/badge-icon";
import { ModalProps } from "@/types/prop.types";
import Modal from "./modals/modal";
import { Skeleton } from "../ui/skeleton";
import { LoaderIcon } from "@/public/icons/loader-icon";

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
    } catch (error: any) {
      console.error(error);
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
      {isLoading && <LoaderIcon className="animate-spin" />}
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
        const listingDescription = (
          <p>
            You have successfully deleted the{" "}
            <span className="capitalize">"{deletedListing?.data?.title}"</span>{" "}
            property from your listings
          </p>
        );

        toast({
          variant: "info",
          title: "Property Deleted!",
          description: listingDescription,
        });
        router.push("/listings");
      } else {
        throw deletedListing.error;
      }
    } catch (error: any) {
      console.error(error);
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
      {isLoading && <LoaderIcon className="animate-spin" />}
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
      console.error(error);
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
          {isLoading && <LoaderIcon className="animate-spin" />}
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
  user: UserPublic | undefined;
}) {
  const isPending = useRef(false);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (isPending.current || !user) return;

    isPending.current = true;
    setLoading(true);

    try {
      const transactionId = uuidv4();
      const idempotencyKey = createIdempotencyKey(
        "checkout",
        user.id,
        "landlord_credits",
        transactionId,
      );

      const requestBody = {
        purchaseType: PURCHASE_TYPES.LANDLORD_PREMIUM.type,
        priceId: PRICING.landlord.premium.monthly.priceId,
        landlordPremiumPrice: PRICING.landlord.premium.monthly.amount,
        userId: user.id,
        userEmail: user.email,
        userName: user.full_name,
        userRoleId: `${user.role_id}` as RoleType,
        idempotencyKey,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast({ variant: "info", description: error });
        throw new Error(error);
      }

      const { sessionId } = await res.json();

      if (!publishableKey) throw new Error("Missing Stripe key");

      const stripe = await loadStripe(publishableKey);
      await stripe?.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err);
    } finally {
      isPending.current = false;
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      className="h-full w-full px-11 py-3 text-base leading-6 sm:w-fit"
    >
      {loading && <LoaderIcon className="size-4 animate-spin" />}
      {loading ? "Processing..." : "Go Premium"}
    </Button>
  );
}

export function SwitchToBasicBtn({ userId }: { userId: string | null }) {
  const [billingPortalUrl, setBillingPortalUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function createPortalSession(userId: string): Promise<string> {
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

  useEffect(() => {
    if (!userId) return;

    createPortalSession(userId)
      .then(setBillingPortalUrl)
      .catch((err) => console.error(err));
  }, [userId]);

  // TODO: loading state now working, figure out issue and fix
  async function handleRedirect() {
    setIsLoading(true);
    if (!userId) {
      toast({
        variant: "destructive",
        description: "Missing user ID. Please reload and try again.",
        showCloseButton: false,
      });
      return;
    }

    try {
      const url = billingPortalUrl ?? (await createPortalSession(userId));
      if (!url) throw new Error("Failed to create billing portal session.");

      setBillingPortalUrl(url);
      window.location.href = url;
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message ?? "Unknown error occurred.",
        showCloseButton: false,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleRedirect}
      disabled={isLoading}
      className="h-full w-full flex-1 border-x-1 border-transparent px-0 py-3 text-base leading-6"
    >
      {isLoading && <LoaderIcon className="size-4 animate-spin" />}
      {isLoading ? "Processing..." : "Switch to Basic"}
    </Button>
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
  const [isDeleting, setIsDeleting] = useState(false);

  const conversationParticipantsMutation = useUpdateConversationParticipants();

  const chatToastDescription = (
    <p>
      Your chat with
      <span className="capitalize">"{chatName}"</span> has been deleted!
    </p>
  );

  async function handleChatDeletion() {
    if (!user?.id || !conversationId) return;

    setIsDeleting(true);

    try {
      const currentDate = new Date().toISOString();

      const result = await conversationParticipantsMutation.mutateAsync({
        conversationData: {
          userId: user.id,
          conversationId,
        },
        conversationParticipantsDetails: {
          deleted_at: currentDate,
          message_cutoff_at: currentDate,
        },
      });

      if (!result.success) throw new Error(result.error?.message);

      toast({
        variant: "success",
        showCloseButton: false,
        description: chatToastDescription,
      });

      setIsDeleteModalOpen(false);
      router.push("/messages");
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Unable to delete chat",
        description: error?.message ?? "An error occurred",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleChatDeletion}
      disabled={isDeleting}
      className="flex h-full w-full flex-1 items-center border-x-1 border-transparent px-0"
    >
      {isDeleting && <LoaderIcon className="size-4 animate-spin" />}
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
