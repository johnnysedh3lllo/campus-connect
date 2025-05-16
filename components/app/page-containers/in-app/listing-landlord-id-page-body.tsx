"use client";

import { Separator } from "@/components/ui/separator";
import { BackButton } from "../../action-buttons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "@/public/icons/user-icon";
import { useGetUserPublic } from "@/hooks/tanstack/use-get-user-public";
import { useGetPublishedListings } from "@/hooks/tanstack/use-get-published-listings";
import ListingCard from "../../listing-card";
import { ListingLandlordProfileSkeleton } from "../../skeletons/listing-landlord-id-page-skeleton";
import { ListingsCardSkeleton } from "../../skeletons/listings-card-skeleton";
import { useUserStore } from "@/lib/store/user-store";
import { useCreateConversation } from "@/hooks/tanstack/mutations/use-create-conversation";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function ListingLandlordIdPageBody({
  landlordId,
}: {
  landlordId: string;
}) {
  const { userId, userRoleId } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data: landlordProfile, isLoading: isUserProfileLoading } =
    useGetUserPublic(landlordId || undefined);

  const { data: listingData, isLoading: isPublishedListingsLoading } =
    useGetPublishedListings(landlordId, "published");

  const fullName = `${landlordProfile?.first_name} ${landlordProfile?.last_name}`;
  const avatarUrl = landlordProfile?.avatar_url;

  const publishedListings = listingData?.data;

  const numOfListings = publishedListings?.length;

  const createConversationMutation = useCreateConversation();

  async function handleMessage() {
    if (!userId) return;
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

        router.push(`/messages/${createdConversation}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <section>
      <section className="max-w-screen-max-xl mx-auto flex w-full gap-3 p-4">
        <BackButton className="flex" route="/listings" />
        <header className="flex flex-col gap-3">
          <h1 className="text-2xl leading-10 font-semibold capitalize sm:text-4xl sm:leading-11">
            Landlord’s Profile
          </h1>
          <p className="text-text-secondary flex gap-2 text-sm leading-6">
            Have look at this landlord’s property listings
          </p>
        </header>
      </section>
      <Separator />
      {/* {isUserProfileLoading || isPublishedListingsLoading ? (
        <ListingLandlordProfileSkeleton />
      ) : ( */}
      <section className="max-w-screen-max-xl mx-auto w-full px-4 py-6 sm:grid sm:grid-cols-[1fr_2fr] sm:gap-6 sm:py-12 lg:px-10 xl:px-4">
        {isUserProfileLoading ? (
          <ListingLandlordProfileSkeleton />
        ) : (
          <div className="border-line border-b-0.6 lg:border-r-0.6 pb-4 lg:border-b-0 lg:pr-4">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="size-22 items-center justify-center overflow-hidden rounded-full bg-gray-100 sm:size-35">
                  <AvatarImage
                    src={avatarUrl ?? undefined}
                    alt="Profile picture"
                  />
                  <AvatarFallback className="size-9 overflow-hidden bg-transparent sm:size-full">
                    <UserIcon className="text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <section className="flex flex-col items-center gap-2">
                  <h3 className="text-text-primary text-2xl leading-8 font-semibold capitalize">
                    {fullName}
                  </h3>

                  <p className="text-text-secondary text-sm leading-6 capitalize">
                    {numOfListings} Properties
                  </p>
                </section>
              </div>

              <Separator className="hidden lg:block" />

              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <Button
                  disabled={isLoading}
                  onClick={handleMessage}
                  className="w-full"
                >
                  {isLoading && <Loader2 className="animate-spin" />}
                  {isLoading ? "Processing...." : "Message"}
                </Button>

                {/* <Link href={`/listings/landlord/${landlordId}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </Link> */}
              </div>
            </div>
          </div>
        )}

        <section className="flex flex-col gap-4 py-6 lg:p-0">
          <h2 className="text-text-primary bg-background sticky top-0 pb-2 text-2xl leading-8 font-semibold">
            Listings
          </h2>

          {isPublishedListingsLoading ? (
            <div className="max-w-screen-max-xl grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {/* Generate 3 property card skeletons */}
              {Array.from({ length: 3 }).map((_, index) => (
                <ListingsCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="max-w-screen-max-xl mx-auto grid grid-cols-1 justify-items-center gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {publishedListings?.map((listing) => (
                <ListingCard listing={listing} key={listing.uuid} />
              ))}
            </div>
          )}
        </section>
      </section>
      )
    </section>
  );
}
