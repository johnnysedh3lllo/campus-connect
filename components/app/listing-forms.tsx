import type React from "react";
import { useEffect, useState } from "react";
import {
  createListingFormSchema,
  homeDetailsFormSchema,
  HomeTypeEnum,
  PaymentFrequencyEnum,
  photoUploadFormSchema,
  pricingFormSchema,
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
import { useCreateListingsStore } from "@/lib/store/create-listings-store";
import {
  CreateListingFormType,
  HomeDetailsFormType,
  PhotoUploadFormType,
  PricingFormType,
} from "@/lib/form.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudArrowUpIcon } from "@/public/icons/cloud-arrow-up-icon";
import { Separator } from "../ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";

import { PhotoCarousel } from "./listing-photo-preview-carousel";
import { CreditBalance } from "./credit-balance";
import { useUserStore } from "@/lib/store/user-store";
import { useGetUserCredits } from "@/hooks/tanstack/use-get-user-credits";
import { useGetActiveSubscription } from "@/hooks/tanstack/use-get-active-subscription";
import { MIN_CREDITS } from "@/lib/app.config";
import Modal from "./modals/modal";
import { SadFaceIcon } from "@/public/icons/sad-face-icon";
import { ModalProps } from "@/lib/prop.types";
import BuyCredits from "./buy-credits";
import Link from "next/link";
import { createListing } from "@/app/actions/supabase/listings";
import { Loader2 } from "lucide-react";

export function HomeDetailsForm() {
  const { step, steps, data, nextStep, prevStep, setData } =
    useCreateListingsStore();

  // Define the form
  const form = useForm<HomeDetailsFormType>({
    resolver: zodResolver(homeDetailsFormSchema),
    defaultValues: {
      title: data.title ?? "",
      noOfBedrooms: data.noOfBedrooms ?? 1,
      listingType: data.listingType ?? undefined,
      location: data.listingType ?? "",
      description: data.description ?? "",
    },
    mode: "onChange",
  });

  //   useEffect(() => {
  //     if (homeDetails) {
  //       form.reset({
  //         title: homeDetails.title || "",
  //         noOfBedRooms: homeDetails.noOfBedRooms || "",
  //         listingType: homeDetails.listingType || "condo",
  //         location: homeDetails.location || "",
  //         description: homeDetails.description || "",
  //       });
  //     }
  //   }, [homeDetails, form]);

  // Handle form submission

  function onSubmit(values: HomeDetailsFormType) {
    setData(values);
    nextStep();
  }

  // Handle back button
  function handleBack() {
    prevStep();
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
              <FormLabel className="leading-6 font-medium">Title</FormLabel>
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
                Number of Bedrooms
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

        {/* Home Type Select */}
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
          <Button type="submit" className="w-full sm:w-50">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function PhotoUploadForm() {
  const { step, steps, data, setData, nextStep, prevStep } =
    useCreateListingsStore();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<PhotoUploadFormType>({
    resolver: zodResolver(photoUploadFormSchema),
    defaultValues: {
      photos: data.photos || [],
    },
  });

  const { formState, setValue, watch } = form;
  const photos = watch("photos") || [];
  const photoCount = photos.length;

  // Initialize preview URLs from existing photos in store
  useEffect(() => {
    if (data.photos && data.photos.length > 0 && previewUrls.length === 0) {
      const urls = data.photos.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }

    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [data.photos, previewUrls.length]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);

    // Check if adding these files would exceed the maximum
    if (photos.length + selectedFiles.length > 10) {
      alert("You can only upload a maximum of 10 photos");
      return;
    }

    // Create preview URLs for the selected files
    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file),
    );

    // Update form value
    const updatedPhotos = [...photos, ...selectedFiles];
    setValue("photos", updatedPhotos, {
      shouldValidate: true,
    });

    // Update preview URLs
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
  };

  // Remove a photo
  const removePhoto = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    // Create new arrays without the removed photo
    const updatedPhotos = [...photos];
    const updatedPreviewUrls = [...previewUrls];

    updatedPhotos.splice(index, 1);
    updatedPreviewUrls.splice(index, 1);

    // Update form value
    setValue("photos", updatedPhotos, {
      shouldValidate: true,
    });

    // Update preview URLs
    setPreviewUrls(updatedPreviewUrls);
  };

  // Handle form submission
  function onSubmit(values: PhotoUploadFormType) {
    setData(values);

    // Move to the next step in the form
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

        <FormField
          control={form.control}
          name="photos"
          render={() => (
            <FormItem className="border-input rounded-md border p-6">
              <FormMessage />

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
                    accept="image/jpeg,image/png"
                    className="sr-only"
                    onChange={handleFileChange}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3">
          <Separator />

          {/* Photo count */}
          <div className="pt-3 text-sm font-medium">
            {photoCount}/10 Photos uploaded
          </div>

          {/* Photo carousel - only show if there are photos */}
          {photoCount > 0 && (
            <PhotoCarousel photos={previewUrls} onRemove={removePhoto} />
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
          <Button type="submit" className="w-full sm:w-50">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function PricingForm() {
  const { setData, nextStep, prevStep, steps, data, step } =
    useCreateListingsStore();

  const form = useForm<PricingFormType>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: {
      paymentFrequency: data.paymentFrequency ?? undefined,
      price: data.price ?? 1,
    },
    mode: "onChange",
  });

  // Handle form submission
  function onSubmit(values: PricingFormType) {
    setData(values);
    nextStep();
  }

  function handleBack() {
    prevStep();
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
          <Button type="submit" className="w-full sm:w-50">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function PreviewPage() {
  const { userId, userRoleId } = useUserStore();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const { data: creditRecord } = useGetUserCredits(
    userId || undefined,
    userRoleId,
  );
  const { data: userActiveSubscription } = useGetActiveSubscription(
    userId || undefined,
    userRoleId,
  );

  const creditAmount = creditRecord?.remaining_credits;
  const hasActiveSubscription = userActiveSubscription?.status === "active";
  const hasEnoughCredits = creditAmount && creditAmount >= MIN_CREDITS;

  const { step, steps, prevStep, data } = useCreateListingsStore();

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // TODO: THESE VALUES MAY BE EMPTY DUE TO EMPTY STRINGS, HANDLE ACCORDINGLY
  const defaultValue = "Not Defined";
  const title = data.title;
  const location = data.location;
  const noOfBedrooms = data.noOfBedrooms;
  const listingType = data.listingType;
  const description = data.description;

  const photos = data.photos;

  const paymentFrequency = data?.paymentFrequency;
  const price = data?.price;

  useEffect(() => {
    if (photos?.length) {
      const photoPreviewUrls = photos.map((file) => URL.createObjectURL(file));
      setPreviewUrls(photoPreviewUrls);

      return () => {
        photoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [photos]);

  const form = useForm<CreateListingFormType>({
    resolver: zodResolver(createListingFormSchema),
    defaultValues: {
      title,
      location,
      noOfBedrooms,
      listingType,
      description,
      photos,
      paymentFrequency,
      price,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function handlePublish(values: any) {
    if (!hasActiveSubscription && !hasEnoughCredits) {
      console.log("this user can't upload a property");
      setIsErrorModalOpen(true);
    } else {
      try {
        // TODO: USER TANSTACK QUERY MUTATIONS
        const result = await createListing(userId, values);
      } catch (error) {}

      console.log("this user can upload a property");
      console.log("credit amount", creditAmount);
      console.log("min credits", MIN_CREDITS);
      console.log("has an active sub", hasActiveSubscription);
      console.log(values);
    }
  }

  const listingErrorModal: ModalProps = {
    modalId: "land_listing_error",
    variant: "error",
    title: "You are unable to list a property",
    description: "Buy credits now, or join our premium plan",
    modalImage: <SadFaceIcon />,
    open: isErrorModalOpen,
    setOpen: setIsErrorModalOpen,
  };

  return (
    <div className="w-full md:max-w-202">
      <h2 className="flex w-full items-center justify-between text-2xl leading-8 font-semibold">
        {steps[step]}
      </h2>

      <section className="flex flex-col gap-6">
        <PhotoCarouselGeneric photos={previewUrls} />

        <Separator />
      </section>

      <section className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        <div>
          <h3 className="text-sm leading-6 font-medium">Title</h3>
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

        <div className="col-span-full">
          <h3 className="text-sm leading-6 font-medium">
            Your Available Credits
          </h3>
          <CreditBalance disabled creditAmount={creditAmount} />
        </div>
      </section>

      <div className="mt-16 flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
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
          <form onSubmit={form.handleSubmit(handlePublish)}>
            <Button
              type="submit"
              disabled={previewUrls.length === 0 || isSubmitting} // TODO: FIND A BETTER WAY TO HANDLE THIS DISABLED STATE HERE
              className="w-full sm:w-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Publishing" : "Publish"}
            </Button>
          </form>
        </Form>
      </div>

      <Modal {...listingErrorModal}>
        <BuyCredits variant="outline" />

        <Link className="w-full" href="/plans">
          <Button className="w-full">Get Premium</Button>
        </Link>
      </Modal>
    </div>
  );
}

function PhotoCarouselGeneric({ photos }: { photos: string[] }) {
  return (
    <div className="relative w-full">
      <Carousel className="w-full" opts={{ align: "start", slidesToScroll: 1 }}>
        {/* Left navigation button - using ShadCN's CarouselPrevious */}
        <CarouselPrevious className="bg-background-secondary absolute -left-5 z-10 size-10 rounded-sm border-0 p-3" />

        {/* Photos container */}
        <CarouselContent className="flex w-full gap-3">
          {photos.map((url, idx) => (
            <CarouselItem key={idx} className="p-0 sm:basis-1/3">
              <Image
                width={200}
                height={200}
                src={url}
                className="aspect-square h-full w-full overflow-hidden rounded-sm object-cover"
                alt={url}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Right navigation button - using ShadCN's CarouselNext */}
        <CarouselNext className="bg-background-secondary absolute -right-5 z-10 size-10 rounded-sm border-0 p-3" />
      </Carousel>
    </div>
  );
}
