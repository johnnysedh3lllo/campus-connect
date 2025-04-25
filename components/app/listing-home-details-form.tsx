"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createListingFormSchema, HomeTypeEnum } from '@/lib/form.schemas'
import { useListingCreationStore } from '@/lib/store/listing-creation-store';
import Image from 'next/image'

// Extract home details schema
const homeDetailsFormSchema = createListingFormSchema.shape.homeDetails;
type HomeDetailsFormType = z.infer<typeof homeDetailsFormSchema>

export default function HomeDetailsForm() {
    const { step, steps, setData, nextStep, prevStep, homeDetails } = useListingCreationStore();

    // Define the form
    const form = useForm<HomeDetailsFormType>({
        resolver: zodResolver(homeDetailsFormSchema),
        defaultValues: {
            title: homeDetails?.title || '',
            noOfBedRooms: homeDetails?.noOfBedRooms || '',
            homeType: homeDetails?.homeType || 'condo',
            homeAddress: homeDetails?.homeAddress || '',
            description: homeDetails?.description || '',
        }
    });

    // Handle form submission
    function onSubmit(data: HomeDetailsFormType) {
        setData({ homeDetails: data });
        nextStep();
    };

    // Handle back button
    function handleBack() {
        prevStep();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:w-full md:max-w-212 flex flex-col gap-6">
                <h1 className="flex w-full items-center justify-between text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
                    {steps[step]}
                </h1>

                {/* Title Input */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel className='font-medium'>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter listing title" {...field} className='w-full' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Number of Bedrooms Input */}
                <FormField
                    control={form.control}
                    name="noOfBedRooms"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-medium'>Number of Bedrooms</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Enter number of bedrooms" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Home Type Select */}
                <FormField
                    control={form.control}
                    name="homeType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-medium'>Home Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} >
                                <FormControl className='bg-white'>
                                    <SelectTrigger className='w-full rounded-sm bg-white'>
                                        <SelectValue placeholder="Select home type" className='bg-white' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        {HomeTypeEnum.options.map((type) => (
                                            <SelectItem key={type} value={type}>
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

                {/* Home Address Input */}
                <FormField
                    control={form.control}
                    name="homeAddress"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-medium'>Home Address</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input placeholder="Enter address" {...field} className="pr-10" />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Image width={24} height={24} src={"/icons/icon-location.svg"} alt={"Location Icon"} className="h-5 w-5 text-gray-400" />
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
                        <FormItem>
                            <FormLabel className='font-medium'>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter home description"
                                    {...field}
                                    className="h-46 text-start pt-2 bg-white text-black rounded-md placeholder:text-gray-600"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='w-full flex flex-col-reverse sm:flex-row gap-4 items-center justify-between'>

                    <Button type="button" variant={"outline"} onClick={handleBack} className='w-full sm:w-50' disabled={step < 0}>
                        Back
                    </Button>
                    <Button type="submit" className='w-full sm:w-50'>Next</Button>
                </div>
            </form>
        </Form>
    );
}