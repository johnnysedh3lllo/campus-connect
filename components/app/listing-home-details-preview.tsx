"use client"

import { useEffect, useState } from 'react'
import { useRef } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast"

import ListingCreatePreviewImage from '@/components/app/listing-create-preview-image'
import { useListingCreationStore } from '@/lib/store/listing-creation-store'
import { PaymentFrequencyEnum } from '@/lib/form-schemas';
import { z } from "zod"
import Image from 'next/image';

type PaymentFrequency = z.infer<typeof PaymentFrequencyEnum>;
// Extracted utility function with improved readability
const mapPaymentFrequencyToLabel = (paymentFrequency: PaymentFrequency): string => {
    const frequencyMap: Record<PaymentFrequency, string> = {
        Daily: 'Day',
        Weekly: 'Week',
        Monthly: 'Month',
        Yearly: 'Month'
    };

    return frequencyMap[paymentFrequency]?.toLowerCase() || '';
};

// Extracted component for rendering preview details
const HomeDetailsPreview = ({ homeDetails, pricing }: {
    homeDetails: any,
    pricing?: { price?: number, paymentFrequency?: PaymentFrequency }
}) => (
    <section className='grid grid-cols-2 sm:grid-cols-3 gap-6'>
        {[
            { label: 'Title', value: homeDetails.title },
            { label: 'Home type', value: homeDetails.homeType },
            { label: 'Location', value: homeDetails.homeAddress },
            pricing?.price && {
                label: 'Price',
                value: `${pricing.price}/${mapPaymentFrequencyToLabel(pricing.paymentFrequency!)}`
            },
            { label: 'No of Bedrooms', value: homeDetails.noOfBedRooms },
        ].filter((detail): detail is { label: string; value: any } => Boolean(detail)).map((detail, index) => (
            <div key={detail.label} className={detail.label === 'Description' ? 'col-span-full' : ''}>
                <h3 className='font-medium text-sm leading-6'>{detail.label}</h3>
                <p className='text-sm text-gray-700'>{detail.value}</p>
            </div>
        ))}

        {homeDetails.description && (
            <div className='col-span-full'>
                <h3 className='font-medium text-sm leading-6'>Description</h3>
                <p className='text-sm text-gray-700'>{homeDetails.description}</p>
            </div>
        )}

        <div className='col-span-full'>
            <h3 className='font-medium text-sm leading-6'>Your Available Credits</h3>
            <div className="hidden lg:flex lg:items-center lg:gap-2">
                <Image width={24} height={24} alt="credit chip" src={"/icons/icon-credit-chip.svg"} />
                <p className="text-sm leading-6 font-medium">800 Credits</p>
            </div>
        </div>
    </section>
);

function ListingCreationPreviewPage() {
    const {
        step,
        steps,
        photos,
        homeDetails,
        pricing,
        clearData,
        prevStep
    } = useListingCreationStore();

    const [previews, setPreviews] = useState<string[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Extracted preview URL management logic
    useEffect(() => {
        if (photos?.length) {
            const photoPreviewUrls = photos.map(file => URL.createObjectURL(file));
            setPreviews(photoPreviewUrls);

            return () => {
                photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
            };
        }
    }, [photos]);

    // Simplified handler functions
    const handlePublish = () => {
        clearData();
        toast({
            title: "Listing Published",
            description: "Your listing has been successfully published.",
        });
    };

    return (
        <div className='w-full md:max-w-202'>
            <h1 className="flex w-full items-center justify-between text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
                {steps[step]}
            </h1>

            <div className='mt-4'></div>

            {previews.length > 0 && (
                <>
                    <ListingCreatePreviewImage
                        isUploading={false}
                        previews={previews}
                        scrollContainerRef={scrollContainerRef}
                    />
                    <Separator className='my-6' />
                </>
            )}

            {homeDetails && (
                <HomeDetailsPreview
                    homeDetails={homeDetails}
                    pricing={pricing}
                />
            )}

            <div className='w-full flex flex-col-reverse sm:flex-row gap-4 items-center justify-between mt-16'>
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className='w-full sm:w-50'
                >
                    Back
                </Button>
                <Button
                    type="button"
                    onClick={handlePublish}
                    disabled={previews.length === 0}
                    className='w-full sm:w-50'
                >
                    Publish
                </Button>
            </div>
        </div>
    );
}

export default ListingCreationPreviewPage