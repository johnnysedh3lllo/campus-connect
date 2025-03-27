"use client"
import { useListingCreationStore } from "@/lib/store/listing-creation-store";
import { Badge } from "@/components/ui/badge";
import { ReactNode, useRef } from "react";
import Image from "next/image";
import { AnimationWrapper } from "@/lib/providers/AnimationWrapper";
import { formVariants, animationConfig } from "@/hooks/animations";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator"
import HomeDetailsForm from "@/components/app/listing-home-details-form";
import PhotoUploadForm from "@/components/app/listing-photo-upload-form";
import PricingForm from "@/components/app/listing-pricing-form";
import ListingCreationPreviewPage from "@/components/app/listing-home-details-preview";


function CreatePage({ children }: { children: ReactNode }) {
    const router = useRouter()
    const listingFormWrapper = useRef<HTMLDivElement>(null);
    const { step, steps, clearData } = useListingCreationStore()

    function handleEscape() {
        clearData()
        router.push("/listings");
    }
    const stepComponents = [
        <HomeDetailsForm />,
        <PhotoUploadForm />,
        <PricingForm />,
        <ListingCreationPreviewPage />
    ]

    return (
        <section className="flex flex-col gap-12">
            <header className="md:mx-20 border-b pb-3 px-4 sm:px-12 md:px-0">
                <h1 className="flex w-full items-center justify-between text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
                    New Listing

                    <Image src={"/icons/icon-close-no-borders.svg"} alt="Close Icon" width={40} height={40} className="cursor-pointer" onClick={handleEscape} />
                </h1>
                <p className="text-sm text-[#878787]">Enter any necessary information</p>
            </header>
            <div
                className="onboarding-form--wrapper grid grid-cols-1 md:grid-cols-[.7fr_4fr] gap-6 px-4 sm:px-12 sm:gap-12 md:px-0 md:mx-20 lg:overflow-x-hidden lg:overflow-y-auto"
                ref={listingFormWrapper}
            >
                    <div className="bg-background sticky sm:hidden top-0 flex gap-1 py-4 lg:pe-4">
                        <Badge variant="outline">{`${step + 1}/${steps.length}`}</Badge>

                        <div className="grid w-full grid-flow-row grid-cols-4 items-center gap-1">
                            {steps.map((_, index) => (
                                <div className="bg-accent-secondary h-0.5" key={`step-${index}`}>
                                    <div
                                        className={`h-full transition-all duration-500 ${index <= step ? "bg-primary w-full" : "w-0"}`}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </div>

                <div> <div className="hidden sm:grid grid-flow-col md:grid-flow-row auto-cols-auto md:auto-rows-auto items-center md:items-start gap-3">
                    {steps.map((item, index) => (
                        <div key={index} className="grid grid-flow-col md:grid-flow-row auto-cols-auto items-center md:items-start md:self-start gap-3">
                            <div className="grid grid-flow-col items-center md:justify-start gap-3">
                                <span
                                    className={`inline-grid place-items-center aspect-square w-7 rounded-full bg-gray-600 ${step === index && "bg-transparent border border-primary text-primary"
                                        } ${step > index && "bg-primary text-white"}`}
                                >
                                    {index + 1}
                                </span>
                                <span className={`text-gray-600 ${step === index && "font-semibold text-black!"}`}>
                                    {item}
                                </span>
                            </div>
                            {index !== steps.length - 1 && (
                                <Separator className="w-10 h-[2px] md:w-[2px] md:h-10 bg-gray-300 md:translate-x-3" />
                            )}
                        </div>
                    ))}
                </div></div>

                <AnimationWrapper
                    variants={formVariants}
                    transition={animationConfig}
                    count={step}
                    classes="w-full"
                >
                    {stepComponents[step]}
                </AnimationWrapper>
            </div>
        </section>
    )
}

export default CreatePage