"use client"
import { createListingFormSchema, PaymentFrequencyEnum } from '@/lib/form.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup
} from '@/components/ui/select'
import { useListingCreationStore } from '@/lib/store/listing-creation-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PricingFormSchema = createListingFormSchema.shape.pricing;
type PricingFormType = z.infer<typeof PricingFormSchema>;

function PricingForm() {
    const { setData, nextStep, prevStep, steps, step, pricing } = useListingCreationStore()

    // Handle form submission
    function onSubmit(data: PricingFormType) {
        setData({ pricing: data });
        nextStep();
    };

    // Handle back button
    function handleBack() {
        prevStep();
    };

    const form = useForm<PricingFormType>({
        resolver: zodResolver(PricingFormSchema),
        defaultValues: {
            paymentFrequency: pricing?.paymentFrequency || PaymentFrequencyEnum.Values.daily,
            price: pricing?.price || 0
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:max-w-200 flex flex-col gap-6">
                <h1 className="flex w-full items-center justify-between text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
                    {steps[step]}
                </h1>
                {/* Home Type Select */}
                <div className='flex flex-col sm:flex-row gap-6 items-center justify-between'>
                    <FormField
                        control={form.control}
                        name="paymentFrequency"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel className='font-medium'>How do you want tenants to pay rent</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                    <FormControl className='bg-white'>
                                        <SelectTrigger className='w-full rounded-sm bg-white flex justify-between items-center capitalize'>
                                            <SelectValue placeholder="Select payment frequency" className='bg-white ' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            {PaymentFrequencyEnum.options.map((type) => (
                                                <SelectItem key={type} value={type} className='capitalize'>
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
                            <FormItem className='w-full'>
                                <FormLabel className='font-medium'>How much do you want tenants to pay</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter a price" {...field} onChange={(e) => {
                                        field.onChange(Number(e.target.value))
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='w-full flex flex-col-reverse sm:flex-row gap-4 items-center justify-between'>
                    <Button type="button" variant={"outline"} onClick={handleBack} className='w-full sm:w-50' disabled={step < 0}>
                        Back
                    </Button>
                    <Button type="submit" className='w-full sm:w-50'>Next</Button>
                </div>
            </form>
        </Form>
    )
}

export default PricingForm