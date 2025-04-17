"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteListingById, getListingById } from "@/app/actions/actions";
import { ListingType } from "../page";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListingDetailsImageGallery } from "@/components/app/listing-details-image-gallery";
import { mapPaymentFrequencyToLabel } from "@/components/app/listing-home-details-preview";
import { LocationIcon } from "@/public/icons/icon-location";
import { KabobIcon } from "@/public/icons/kabob-icon";
import { BackIcon } from "@/public/icons/back-icon";
import { HouseIcon } from "@/public/icons/icon-house";
import { BedIcon } from "@/public/icons/icon-bed";
import { TagIcon } from "lucide-react";
import { EditIcon } from "@/public/icons/edit-icon";
import { TrashIconOutlined } from "@/public/icons/icon-trash-outlined";
import ListingActionModal from "@/components/app/listing-action-modal";
import { TrashCanIconFull } from "@/public/icons/icon-trash-full";

type PropertyHighlightItemProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

type ResponsiveHeaderProps = {
  title: string;
  subtitle: string | null;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
};

type PaymentFrequency = "daily" | "weekly" | "monthly" | "yearly";

type ListingImage = {
  id: number;
  image_url: string;
  listing_uuid?: string;
};

const PropertyHighlightItem = ({
  icon,
  label,
  value,
}: PropertyHighlightItemProps): JSX.Element => (
  <div className="border-b border-gray-200 last:border-b-0">
    <div className="flex items-center px-4 py-3">
      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
        {icon}
      </div>
      <div>
        <p className="text-text-secondary text-sm">{label}</p>
        <p className="text-text-primary font-bold">{value}</p>
      </div>
    </div>
  </div>
);

function ResponsiveHeader({
  title,
  subtitle,
  onEditClick,
  onDeleteClick,
}: ResponsiveHeaderProps): JSX.Element {
  const [selectedOption, setSelectedOption] = useState<
    "published" | "unpublish"
  >("published");
  const router = useRouter();

  const handleValueChange = (value: "published" | "unpublish"): void => {
    if (value) setSelectedOption(value);
  };

  return (
    <div className="flex w-full flex-col gap-y-4 pb-6">
      {/* Row with back button, title (on desktop), and controls */}
      <div className="flex w-full items-center justify-between">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex cursor-pointer items-center"
        >
          <BackIcon />
        </button>

        {/* Title section for desktop only */}
        <section className="mx-4 hidden flex-grow md:block">
          <h1 className="text-2xl leading-10 font-semibold capitalize sm:text-4xl sm:leading-11">
            {title}
          </h1>
          <div className="text-text-secondary flex items-center gap-2 text-sm leading-6">
            <LocationIcon color="grey" />
            {subtitle}
          </div>
        </section>

        {/* Controls (always on right) */}
        <div className="flex items-center gap-3">
          <ToggleGroup
            type="single"
            value={selectedOption}
            onValueChange={handleValueChange}
            className="text-text-secondary grid max-w-52 grid-cols-2 items-center justify-between rounded-sm border p-1"
          >
            <ToggleGroupItem
              value="published"
              className="data-[state=on]:bg-background-accent truncate rounded-sm hover:rounded-sm focus:rounded-sm data-[state=on]:rounded-sm data-[state=on]:text-white"
            >
              Published
            </ToggleGroupItem>
            <ToggleGroupItem
              value="unpublish"
              className="data-[state=on]:bg-background-accent rounded-sm hover:rounded-sm focus:rounded-sm data-[state=on]:rounded-sm data-[state=on]:text-white"
            >
              Unpublish
            </ToggleGroupItem>
          </ToggleGroup>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <KabobIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="z-50 p-2"
              align="end"
              sideOffset={5}
            >
              <DropdownMenuItem
                className="rounded-sm p-2"
                onClick={onEditClick}
              >
                <EditIcon color="black" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-sm p-2"
                onClick={onDeleteClick}
              >
                <TrashIconOutlined />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title section for mobile only - takes full width on second row */}
      <div className="w-full md:hidden">
        <h1 className="text-2xl leading-10 font-semibold capitalize sm:text-4xl sm:leading-11">
          {title}
        </h1>
        <div className="text-text-secondary flex items-center gap-2 text-sm leading-6">
          <LocationIcon color="grey" />
          {subtitle}
        </div>
      </div>
    </div>
  );
}

const getImageUrls = (images: ListingImage[]): string[] =>
  images.map((item) => item.image_url);

type ListingDataResult = {
  listing: ListingType | undefined;
  isLoading: boolean;
  error: Error | null;
};

function useListingData(id: string): ListingDataResult {
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData<{ listings: ListingType[] }>([
    "listings",
  ]);
  const cachedListing = cachedData?.listings?.find(
    (listing) => listing.uuid === id,
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListingById(id as string),
    staleTime: 1000 * 60 * 5,
    enabled: !cachedListing,
  });

  return {
    listing: cachedListing || data?.listing,
    isLoading: isLoading && !cachedListing,
    error: error as Error | null,
  };
}

export default function ListingDetailPage(): JSX.Element {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = useParams();
  const listingId =
    typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";
  const { listing, isLoading, error } = useListingData(listingId);
  const [isModalOpEN, setIsModalOpen] = useState(false);

  if (isLoading) return <div className="p-8">Loading listing details...</div>;
  if (error)
    return <div className="p-8">Error loading listing: {error.message}</div>;
  if (!listing) return <div className="p-8">Listing not found</div>;

  const formattedTitle = `${listing.no_of_bedrooms} Bedroom ${listing.home_type}`;
  const paymentFrequency = listing.payment_frequency as PaymentFrequency;
  const paymentInfo = `$${listing.price}/${mapPaymentFrequencyToLabel(paymentFrequency)}`;
  function handleModalClose() {
    setIsModalOpen(false);
  }
  async function handleDeleteListing() {
    try {
      if (!listing?.uuid) throw new Error("Listing Doesn't exist");
      const response = await deleteListingById(listing?.uuid);
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      router.push("/listings");
    } catch (error) {}
  }

  return (
    <>
      <section className="px-4 py-5 sm:px-12 sm:py-10 md:px-16 md:py-12">
        <ResponsiveHeader
          title={formattedTitle}
          subtitle={listing.location}
          onDeleteClick={() => setIsModalOpen(true)}
        />

        <section className="grid grid-cols-1 gap-6 md:grid-cols-[3fr_1fr]">
          <div className="flex flex-col items-start gap-6">
            <ListingDetailsImageGallery
              images={getImageUrls(listing.listing_images)}
            />
            <p>{listing.description}</p>
          </div>

          <div className="flex w-full flex-col items-center justify-start">
            <div className="border-line w-full overflow-hidden rounded-lg border bg-white shadow-sm md:max-w-82">
              <div className="bg-background-secondary border-line border-b p-4">
                <h2 className="text-text-primary text-xl font-bold">
                  Property Highlights
                </h2>
              </div>

              <PropertyHighlightItem
                icon={<TagIcon />}
                label="Price"
                value={<>{paymentInfo}</>}
              />

              <PropertyHighlightItem
                icon={<BedIcon />}
                label="No of Bedrooms"
                value={`${listing.no_of_bedrooms} Rooms`}
              />

              <PropertyHighlightItem
                icon={<HouseIcon />}
                label="Home Type"
                value={<span className="capitalize">{listing.home_type}</span>}
              />
            </div>
          </div>
        </section>
      </section>
      <ListingActionModal
        isOpen={isModalOpEN}
        onClose={handleModalClose}
        variant="error"
        title="Delete Listing"
        message="You are about to delete this property from your listing, are you sure you want to continue?"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onPrimaryAction={handleDeleteListing}
        onSecondaryAction={handleModalClose}
        icon={<TrashCanIconFull />}
      />
    </>
  );
}
