import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "./header";

export function ListingEditSkeleton() {
  return (
    <section className="flex flex-col gap-12">
      <Header
        title="Edit Listing"
        subTitle="Enter any necessary information"
        showButton={false}
      />
      <div className="animate-pulse">
        <div className="max-w-screen-max-xl onboarding-form--wrapper mx-auto grid w-full grid-cols-1 gap-6 p-4 sm:gap-12 sm:px-12 sm:pt-10 md:grid-cols-[.7fr_4fr] md:px-12 lg:overflow-x-hidden lg:overflow-y-auto">
          {/* Progress Bar (Mobile) */}
          <div className="bg-background sticky top-0 flex gap-1 py-4 sm:hidden lg:pe-4">
            <Skeleton className="h-6 w-14 rounded" />
            <div className="grid w-full grid-flow-row grid-cols-4 items-center gap-1">
              {[1, 2, 3, 4].map((_, i) => (
                <div className="bg-accent-secondary h-0.5" key={i}>
                  <div
                    className={`h-full transition-all duration-500 ${i === 0 ? "bg-primary w-full" : "w-0"}`}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Stepper (Desktop) */}
          <div className="hidden auto-cols-auto grid-flow-col content-start items-center gap-3 sm:grid md:grid-flow-row md:auto-rows-auto md:items-start">
            {["Home Details", "Photo Upload", "Pricing", "Preview"].map(
              (item, index) => (
                <div
                  key={index}
                  className="grid auto-cols-auto grid-flow-col items-center gap-3 md:grid-flow-row md:items-start md:self-start"
                >
                  <div className="grid grid-flow-col items-center gap-3 md:justify-start">
                    <span className="bg-line inline-grid aspect-square w-7 place-items-center rounded-full" />
                    <span className="bg-muted h-4 w-20 rounded" />
                  </div>
                  {index !== 3 && (
                    <div className="bg-line h-[2px] w-10 md:h-10 md:w-[2px] md:translate-x-3" />
                  )}
                </div>
              ),
            )}
          </div>
          {/* Step Content Skeleton */}
          <div className="flex w-full flex-col gap-6 md:w-full md:max-w-212">
            <div className="bg-muted mb-2 h-10 w-40 rounded" />
            {/* Title */}
            <div className="flex flex-col gap-2">
              <div className="bg-muted h-5 w-24 rounded" />
              <Skeleton className="h-10 w-full" />
            </div>
            {/* Bedrooms */}
            <div className="flex flex-col gap-2">
              <div className="bg-muted h-5 w-32 rounded" />
              <Skeleton className="h-10 w-full" />
            </div>
            {/* Home Type */}
            <div className="flex flex-col gap-2">
              <div className="bg-muted h-5 w-24 rounded" />
              <Skeleton className="h-10 w-full" />
            </div>
            {/* Address */}
            <div className="flex flex-col gap-2">
              <div className="bg-muted h-5 w-32 rounded" />
              <Skeleton className="h-10 w-full" />
            </div>
            {/* Description */}
            <div className="flex flex-col gap-2">
              <div className="bg-muted h-5 w-24 rounded" />
              <Skeleton className="h-24 w-full" />
            </div>
            {/* Buttons */}
            <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
              <Skeleton className="h-10 w-full sm:w-50" />
              <Skeleton className="h-10 w-full sm:w-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ListingEditError({
  message = "Error loading listing",
}: {
  message?: string;
}) {
  return (
    <section className="flex flex-col gap-12">
      <Header
        title="Edit Listing"
        subTitle="Enter any necessary information"
        showButton={false}
      />
      <div className="flex min-h-[300px] w-full flex-col items-center text-center">
        <div className="text-destructive mb-2 text-lg font-semibold">
          {message}
        </div>
        <div className="text-muted-foreground">
          Please try refreshing the page or check your connection.
        </div>
      </div>
    </section>
  );
}
