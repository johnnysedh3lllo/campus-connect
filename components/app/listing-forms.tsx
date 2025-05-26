"use client";
import type React from "react";
import { useEffect, useState } from "react";
import {
  listingFormSchema,
  homeDetailsFormSchema,
  HomeTypeEnum,
  PaymentFrequencyEnum,
  pricingFormSchema,
  photosFormSchema,
} from "@/lib/form.schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LocationIcon } from "@/public/icons/location-icon";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CreateListingsState } from "@/lib/store/create-listings-store";
import {
  HomeDetailsFormType,
  PricingFormType,
  ListingFormType,
  PhotosFormType,
  PhotoType,
} from "@/types/form.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudArrowUpIcon } from "@/public/icons/cloud-arrow-up-icon";
import { Separator } from "../ui/separator";

import { PhotoCarousel } from "./listing-photo-preview-carousel";
import { CreditBalance } from "./credit-balance";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EditListingsState } from "@/lib/store/edit-listings-store";
import { PhotoCarouselGeneric } from "./photo-carousel-generic";
import { validateImages } from "@/lib/config/app.config";
import {
  ASPECT_RATIO_TOLERANCE,
  LISTING_IMAGE_ASPECT_RATIO,
  MAX_LISTING_IMAGE_HEIGHT,
  MAX_LISTING_IMAGE_SIZE,
  MAX_LISTING_IMAGE_WIDTH,
  MAX_LISTING_IMAGES,
  MAX_TOTAL_LISTING_IMAGE_SIZE,
  MIN_LISTING_IMAGE_HEIGHT,
  MIN_LISTING_IMAGE_SIZE,
  MIN_LISTING_IMAGE_WIDTH,
} from "@/lib/constants";
import { EmptyImageCarousel } from "./empty-image-carousel";

export function HomeDetailsForm({
  defaultValues,
  useListingStore,
}: {
  defaultValues: HomeDetailsFormType;
  useListingStore: () => CreateListingsState | EditListingsState;
}) {
  const { step, steps, prevStep, setData, nextStep } = useListingStore();

  // Define the form
  const form = useForm<HomeDetailsFormType>({
    resolver: zodResolver(homeDetailsFormSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  // Handle back button
  function handleBack() {
    prevStep();
  }

  function onSubmit(values: HomeDetailsFormType) {
    setData(values);
    nextStep();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6 md:w-full md:max-w-212"
      >
        <h2 className="flex w-full items-center justify-between text-2xl leading-8 font-semibold">
          {steps[step]}
        </h2>

        {/* Title Input */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="leading-6 font-medium">
                Name of Listing
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Title"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number of Bedrooms Input */}
        <FormField
          control={form.control}
          name="noOfBedrooms"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="leading-6 font-medium">
                Number of Bedrooms Available
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of bedrooms"
                  value={
                    field.value === undefined || field.value === null
                      ? ""
                      : `${field.value}`
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    // Let user type freely (including an empty string)
                    field.onChange(value === "" ? null : +value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Home Type Selection */}
        <FormField
          control={form.control}
          name="listingType"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="leading-6 font-medium">Home Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="bg-white">
                  <SelectTrigger className="w-full rounded-sm bg-white capitalize">
                    <SelectValue
                      placeholder="Select home type"
                      className="bg-white"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(HomeTypeEnum.enum).map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="capitalize"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Input */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="leading-6 font-medium">Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter Address"
                    {...field}
                    className="pr-10"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <LocationIcon />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Input */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="leading-6 font-medium">
                Description
              </FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Write a brief description of the home"
                  {...field}
                  className="h-46 rounded-md bg-white pt-2 text-start text-black placeholder:text-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="w-full sm:w-50"
            disabled={step <= 0}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-full transition-all duration-150 sm:w-50"
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function PhotoUploadForm({
  defaultValues,
  useListingStore,
}: {
  defaultValues: PhotosFormType;
  useListingStore: () => CreateListingsState | EditListingsState;
}) {
  const { step, steps, prevStep, setData, nextStep } = useListingStore();

  const form = useForm<PhotosFormType>({
    resolver: zodResolver(photosFormSchema),
    defaultValues,
  });

  const {
    formState: { isValid },
    setValue,
    watch,
  } = form;

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const photos = watch("photos") || [];

  // TODO: REVIEW TO FULLY UNDERSTAND HOW THIS ENTIRE COMPONENT HANDLES UPLOADING PHOTOS FOR BOTH SCENARIOS
  // Handle resetting form with new default values (e.g. during edit)
  useEffect(() => {
    form.reset(defaultValues);

    // Initialize preview URLs (convert File -> objectURL, or use string directly)
    const urls = defaultValues.photos.map((photo) => {
      return typeof photo === "string"
        ? photo
        : URL.createObjectURL(photo.file);
    });
    setPreviewUrls(urls);

    // Clean up object URLs
    return () => {
      urls.forEach((url, i) => {
        if (typeof defaultValues.photos[i] !== "string") {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [defaultValues]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    // CHECK 1: if each selected file is a valid file type
    const areValidFileTypes = validateImages.types.check(selectedFiles);

    if (!areValidFileTypes) {
      toast({
        variant: "destructive",
        description: validateImages.types.message.default,
      });
      return;
    }

    // CHECK 2: if each selected file matches individual size constraint
    const areEachValidFileSize = validateImages.sizes.single.check(
      selectedFiles,
      MIN_LISTING_IMAGE_SIZE,
      MAX_LISTING_IMAGE_SIZE,
    );

    if (!areEachValidFileSize) {
      toast({
        variant: "destructive",
        description: validateImages.sizes.single.message.listings,
      });
      return;
    }

    // CHECK 3: if each selected file matches image dimension constraints
    const validateDimensionResult = await Promise.all(
      selectedFiles.map((file) =>
        validateImages.dimensions.check(
          file,
          LISTING_IMAGE_ASPECT_RATIO,
          ASPECT_RATIO_TOLERANCE,
          MIN_LISTING_IMAGE_WIDTH,
          MAX_LISTING_IMAGE_WIDTH,
          MIN_LISTING_IMAGE_HEIGHT,
          MAX_LISTING_IMAGE_HEIGHT,
        ),
      ),
    );

    const areValidDimensions = validateDimensionResult.every(
      (isValid) => isValid,
    );

    if (!areValidDimensions) {
      toast({
        variant: "destructive",
        description: validateImages.dimensions.message.default,
      });
      return;
    }

    // CHECK 4: if total file size does exceeds total size constraint
    const selectedFilesTransformed = selectedFiles.map(
      (file) =>
        ({
          id: undefined,
          file,
          url: undefined,
          path: undefined,
          fullPath: undefined,
          previewUrl: undefined,
        }) as PhotoType,
    );
    const combinedFiles = [...photos, ...selectedFilesTransformed];

    const isValidTotalSize = validateImages.sizes.multiple.check(
      combinedFiles.map((file) => file.file),
      MIN_LISTING_IMAGE_SIZE,
      MAX_TOTAL_LISTING_IMAGE_SIZE,
    );

    if (!isValidTotalSize) {
      toast({
        variant: "destructive",
        description: validateImages.sizes.multiple.message.listings,
      });
      return;
    }

    // CHECK 5: if total amount of images do not exceed constraint
    if (combinedFiles.length > MAX_LISTING_IMAGES) {
      console.log();
      toast({
        variant: "destructive",
        description: `You can only upload a maximum of ${MAX_LISTING_IMAGES} photos`,
      });
      return;
    }

    const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));

    setValue("photos", combinedFiles, { shouldValidate: true });
    setPreviewUrls([...previewUrls, ...newUrls]);
  };

  const removePhoto = (index: number) => {
    const removedPhoto = photos[index].file;
    const updatedPhotos = [...photos];
    const updatedPreviewUrls = [...previewUrls];

    if (removedPhoto instanceof File) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    updatedPhotos.splice(index, 1);
    updatedPreviewUrls.splice(index, 1);

    setValue("photos", updatedPhotos, { shouldValidate: true });
    setPreviewUrls(updatedPreviewUrls);
  };

  function onSubmit(values: PhotosFormType) {
    setData(values);
    nextStep();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6 md:w-full md:max-w-212"
      >
        <h2 className="flex w-full items-center justify-between text-2xl leading-8 font-semibold">
          {steps[step]}
        </h2>

        <div className="flex flex-col gap-3 sm:gap-6">
          <FormField
            control={form.control}
            name="photos"
            render={() => (
              <FormItem className="flex flex-col items-center gap-4">
                <div className="border-input w-full rounded-md border p-6">
                  <FormControl>
                    <div className="border-line-blue bg-background-secondary flex flex-col items-center gap-6 rounded-md border border-dashed p-4 sm:p-6 lg:p-12">
                      <div className="mx-auto flex max-w-58 flex-col items-center gap-3">
                        <CloudArrowUpIcon />
                        <p className="flex flex-col text-center">
                          Upload images of your property
                          <span>(JPEG, PNG)</span>
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="border-line border bg-white px-10 py-2 font-medium hover:bg-gray-50"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        Upload file
                      </Button>

                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/jpg, image/jpeg ,image/png"
                        className="sr-only"
                        onChange={handleFileChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />

          {photos.length > 0 ? (
            <PhotoCarousel photos={previewUrls} onRemove={removePhoto} />
          ) : (
            <EmptyImageCarousel text="Uploaded images will appear here" />
          )}
        </div>

        <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="w-full sm:w-50"
            disabled={step <= 0}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-full transition-all duration-150 sm:w-50"
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function PricingForm({
  defaultValues,
  useListingStore,
}: {
  defaultValues: PricingFormType;
  useListingStore: () => CreateListingsState | EditListingsState;
}) {
  const { prevStep, steps, step, setData, nextStep } = useListingStore();

  const form = useForm<PricingFormType>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  function handleBack() {
    prevStep();
  }

  function onSubmit(values: PricingFormType) {
    setData(values);
    nextStep();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6 md:max-w-200"
      >
        <h2 className="flex w-full items-center justify-between text-2xl leading-8 font-semibold">
          {steps[step]}
        </h2>
        {/* Home Type Select */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="paymentFrequency"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-1">
                <FormLabel className="leading-6 font-medium whitespace-nowrap">
                  How do you want tenants to pay rent
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="bg-white">
                    <SelectTrigger className="flex w-full items-center justify-between rounded-sm bg-white capitalize">
                      <SelectValue
                        placeholder="Select payment frequency"
                        className="bg-white"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(PaymentFrequencyEnum.enum).map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="capitalize"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-1">
                <FormLabel className="leading-6 font-medium whitespace-nowrap">
                  How much do you want tenants to pay
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Enter a price"
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : `${field.value}`
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        // Let user type freely (including an empty string)
                        field.onChange(value === "" ? null : +value);
                      }}
                    />

                    <p className="absolute top-0 right-3 -translate-y-0 text-2xl">
                      $
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <Button
            type="button"
            variant={"outline"}
            onClick={handleBack}
            className="w-full sm:w-50"
            disabled={step < 0}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-full transition-all duration-150 sm:w-50"
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function PreviewPage({
  displayCreditBalance,
  creditAmount,
  hasActiveSubscription,
  defaultValues,
  onSubmit,
  useListingStore,
}: {
  displayCreditBalance?: boolean;
  creditAmount?: number | null | undefined;
  hasActiveSubscription?: boolean;
  defaultValues: ListingFormType;
  onSubmit: (values: ListingFormType) => Promise<void>;
  useListingStore: () => CreateListingsState | EditListingsState;
}) {
  const { step, steps, prevStep } = useListingStore();
  const [previewUrls, setPreviewUrls] = useState<string[] | undefined>([]);

  const title = defaultValues.title;
  const location = defaultValues.location;
  const noOfBedrooms = defaultValues.noOfBedrooms;
  const listingType = defaultValues.listingType;
  const description = defaultValues.description;
  const photos = defaultValues.photos;
  const paymentFrequency = defaultValues?.paymentFrequency;
  const price = defaultValues?.price;

  useEffect(() => {
    if (photos?.length) {
      const photoPreviewUrls = photos?.map((photo) =>
        URL.createObjectURL(photo?.file),
      );
      setPreviewUrls(photoPreviewUrls);

      return () => {
        photoPreviewUrls?.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [defaultValues]);

  const form = useForm<ListingFormType>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: defaultValues,
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const handleClick = () => {
    // TODO: MOVE TO RESPECTIVE FORMS (CREATE OR EDIT LISTINGS)
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Incomplete form",
        description: "Please review form before submitting",
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 md:max-w-202">
      <h2 className="flex w-full items-center justify-between text-2xl leading-8 font-semibold">
        {steps[step]}
      </h2>

      {!previewUrls || previewUrls.length === 0 ? (
        <EmptyImageCarousel text="Please re-upload your images" />
      ) : (
        <section className="flex flex-col gap-6">
          <PhotoCarouselGeneric photos={previewUrls} />

          <Separator />
        </section>
      )}

      <section className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        <div>
          <h3 className="text-sm leading-6 font-medium">Name of Listing</h3>
          <p className="text-sm text-gray-700 capitalize">{title}</p>
        </div>

        <div>
          <h3 className="text-sm leading-6 font-medium">Home type</h3>
          <p className="text-sm text-gray-700 capitalize">{listingType}</p>
        </div>

        <div>
          <h3 className="text-sm leading-6 font-medium">Location</h3>
          <p className="text-sm text-gray-700 capitalize">{location}</p>
        </div>

        <div>
          <h3 className="text-sm leading-6 font-medium">Price</h3>
          <p className="text-sm text-gray-700">
            ${price}/{paymentFrequency}
          </p>
        </div>

        <div>
          <h3 className="text-sm leading-6 font-medium">No of Bedrooms</h3>
          <p className="text-sm text-gray-700 capitalize">{noOfBedrooms}</p>
        </div>

        <div className="col-span-full">
          <h3 className="text-sm leading-6 font-medium">Description</h3>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
        {displayCreditBalance && (
          <div
            className={`col-span-full ${hasActiveSubscription && "opacity-50"}`}
          >
            <h3 className="text-sm leading-6 font-medium">
              Your Available Credits
            </h3>
            <CreditBalance disabled creditAmount={creditAmount} />
          </div>
        )}
      </section>

      <div className="flex w-full flex-col-reverse items-center justify-between gap-4 pt-6 sm:flex-row lg:pt-10">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="w-full sm:w-50"
          disabled={isSubmitting}
        >
          Back
        </Button>

        <Form {...form}>
          <form
            className="w-full sm:w-50"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Button
              type="submit"
              onClick={handleClick} // TODO: FIND A BETTER WAY TO HANDLE THIS DISABLED STATE HERE
              className="w-full transition-all duration-150 sm:w-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Publishing" : "Publish"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
