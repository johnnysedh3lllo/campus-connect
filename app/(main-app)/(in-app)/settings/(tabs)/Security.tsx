"use client"

// UTILITIES
import { useState } from "react"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { resetPasswordAction } from "@/app/actions"
import { changePasswordSchema } from "@/lib/form-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/hooks/use-toast"

// COMPONENTS
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PasswordInput } from "@/components/app/password-input"

// ASSETS
import { Loader2 } from "lucide-react"


export default function Security() {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            password: "",
            confirmPassword: "",
        },
    })

    // Custom submit handler to manage loading state
    const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
        setIsLoading(true)
        try {
            const result = await resetPasswordAction(data)
            console.log(result, 'Result')
            if (result?.success) {
                toast({
                    title: "Password changed successfully",
                    description: "Your password has been updated.",
                })
                // router.replace("/profile") // Redirect to profile or another appropriate page
            } else {
                toast({
                    title: "Password changed successfully",
                    description: "Your password has been updated.",
                })
                throw result?.error
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to change password",
                description: error instanceof Error ? error.message : "An error occurred, please try again later.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="flex w-full flex-col lg:max-w-120 items-start">
            <div className="flex h-full flex-col items-start justify-start w-full lg:max-w-120 gap-6">
                <section className="flex flex-col items-start">
                    <h1 className="text-left leading-10 font-semibold sm:leading-11">Change Password</h1>
                </section>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex w-full flex-col items-start gap-3 pb-6"
                    >
                        <div className="flex w-full flex-col items-start gap-5.5 ">
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem className="flex w-full flex-col items-start gap-1">
                                        <FormLabel className="flex w-full flex-col gap-1 text-left text-sm leading-6 font-medium">
                                            Current Password
                                            <FormControl>
                                                <PasswordInput
                                                    disabled={isLoading}
                                                    required
                                                    placeholder="Enter current password"
                                                    field={field}
                                                />
                                            </FormControl>
                                        </FormLabel>
                                        <span className="text-primary text-sm cursor-pointer">Forgot Password?</span>
                                        <FormMessage className="text-left" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="flex w-full flex-col items-start gap-1">
                                        <FormLabel className="flex w-full flex-col gap-1 text-left text-sm leading-6 font-medium">
                                            New Password
                                            <FormControl>
                                                <PasswordInput disabled={isLoading} required placeholder="Enter new password" field={field} />
                                            </FormControl>
                                        </FormLabel>
                                        <FormMessage className="text-left" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="flex w-full flex-col items-start gap-1">
                                        <FormLabel className="flex w-full flex-col gap-1 text-left text-sm leading-6 font-medium">
                                            Confirm New Password
                                            <FormControl>
                                                <PasswordInput disabled={isLoading} required placeholder="Confirm new password" field={field} />
                                            </FormControl>
                                        </FormLabel>
                                        <FormMessage className="text-left" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="w-1/2 cursor-pointer p-6 text-center text-base leading-6 font-semibold transition-all duration-500"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </section>
    )
}