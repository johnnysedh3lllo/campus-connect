"use client"
import { useState, useRef, useEffect } from 'react'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useListingCreationStore } from '@/lib/store/listing-creation-store'
import ListingCreatePreviewImage from '@/components/app/listing-create-preview-image'

interface PhotoUploadFormType {
    photos: File[];
}

export default function PhotoUploadForm() {
    const { step, steps, setData, nextStep, prevStep, photos: zustandPhotos } = useListingCreationStore();
    const [previews, setPreviews] = useState<string[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const form = useForm<PhotoUploadFormType>({
        resolver: zodResolver(
            z.object({
                photos: z.array(z.instanceof(File)).max(10, { message: "Maximum 10 photos allowed" })
            })
        ),
        defaultValues: {
            photos: []
        }
    });

    useEffect(() => {
        // If zustandPhotos exists and has files
        if (zustandPhotos && zustandPhotos.length > 0) {
            // Set form values
            form.setValue('photos' as Path<PhotoUploadFormType>, zustandPhotos);
    
            // Create previews for existing photos
            const newPreviews = zustandPhotos.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        }
    }, [zustandPhotos, form]);
    
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (files) {
            // Convert FileList to array of File
            const fileArray = Array.from(files);

            // Limit to 10 images
            const limitedFiles = fileArray.slice(0, 10 - previews.length);

            // Use type assertion for setValue
            form.setValue('photos' as Path<PhotoUploadFormType>, [
                ...form.getValues('photos') || [],
                ...limitedFiles
            ]);

            // Create previews
            const newPreviews = limitedFiles.map(file => URL.createObjectURL(file));
            setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
    };

    function removeSpecificImage(indexToRemove: number) {
        // Explicitly get the current files as an array
        const currentFiles = form.getValues('photos') || [];

        // Ensure we're working with an array
        const filesArray = Array.isArray(currentFiles)
            ? currentFiles
            : [currentFiles];

        // Filter out the image at the specified index
        const updatedFiles = filesArray.filter((_, index) => index !== indexToRemove);

        // Update form value and previews
        form.setValue('photos' as Path<PhotoUploadFormType>, updatedFiles);

        const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);
        setPreviews(updatedPreviews);

        // Revoke previous object URL to prevent memory leaks
        URL.revokeObjectURL(previews[indexToRemove]);
    };


    function onSubmit(data: PhotoUploadFormType) {
        setData({ photos: data.photos });
        nextStep();
    };

    function handleBack() {
        prevStep();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-6 md:max-w-200">
                <h1 className="flex w-full items-center justify-between text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
                    {steps[step]}
                </h1>

                <FormField
                    control={form.control}
                    name="photos"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="w-full">
                                    <div className="flex flex-col items-start w-full">
                                        {/* Image Upload Button */}
                                        <label
                                            htmlFor="photo-upload"
                                            className="aspect-square border border-gray-300 flex items-center justify-center cursor-pointer transition w-full h-78 rounded-md p-6"
                                            style={{
                                                pointerEvents: previews.length >= 10 ? 'none' : 'auto',
                                                opacity: previews.length >= 10 ? 0.5 : 1
                                            }}
                                        >
                                            <div className="flex flex-col items-center justify-center text-center bg-blue-100 text-black gap-2 p-3 w-full h-full rounded-md">
                                                <Image src={'/icons/icon-cloud-arrow-up.svg'} alt='Upload Icon' width={32} height={32} />
                                                <span className="text-sm mt-2 hidden sm:inline-block">
                                                    {previews.length < 10
                                                        ? "Upload images of your property (JPEG, PNG)"
                                                        : "Maximum 10 photos reached"}
                                                </span>
                                                <section className='bg-white text-black font-medium hover:bg-gray-300 aspect-[150px/40px] w-30 p-3'>
                                                    Upload File
                                                </section>
                                            </div>
                                            <input
                                                type="file"
                                                id="photo-upload"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleFileChange}
                                                disabled={previews.length >= 10}
                                            />
                                        </label>
                                        <Separator className='my-6' />


                                        {/* Horizontal Image Previews with Navigation */}
                                        <ListingCreatePreviewImage previews={previews} scrollContainerRef={scrollContainerRef} removeSpecificImage={removeSpecificImage} isUploading={true} />
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='w-full flex flex-col-reverse sm:flex-row gap-4 items-center justify-between'>
                    <Button
                        type="button"
                        variant={"outline"}
                        onClick={handleBack}
                        className='w-full sm:w-50'
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        disabled={previews.length === 0}
                        className='w-full sm:w-50'
                    >
                        Next
                    </Button>
                </div>
            </form>
        </Form>
    );
}