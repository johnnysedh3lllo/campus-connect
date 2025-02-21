"use client";
import { signInAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SeparatorMain } from "@/components/app/separator-main";
import { LoginPrompt } from "@/components/app/log-in-prompt";
import { Apple, Facebook, Google } from "@/components/app/social-logos";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Login(props: { searchParams: Promise<Message> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const searchParams = props.searchParams;

  // Custom submit handler to manage loading state
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const result = await signInAction(data);
      // If we're here and there's no error, manually navigate

      if (result?.success) {
        router.replace("/dashboard");
      } else {
        throw result?.error;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto flex w-full flex-col justify-center lg:max-w-120">
      <div className="flex h-full flex-col items-start justify-center gap-4">
        <section className="flex flex-col items-start pb-10">
          <h1 className="text-left text-xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
            Welcome Back!
          </h1>
        </section>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-start gap-3"
          >
            <div className="flex w-full flex-col items-start gap-5.5 px-2 sm:px-0">
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col items-start gap-1">
                    <FormLabel className="flex w-full flex-col gap-1 text-left text-sm leading-6 font-medium">
                      Email Address
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          required
                          placeholder="your@example.com"
                          className="text-left"
                          {...field}
                        />
                      </FormControl>
                    </FormLabel>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />

              <div className="flex w-full flex-col items-start gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col items-start gap-1">
                      <FormLabel className="flex w-full flex-col gap-1 text-left text-sm leading-6 font-medium">
                        Password
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            required
                            type="password"
                            placeholder="Enter your password"
                            className="text-left"
                            {...field}
                          />
                        </FormControl>
                      </FormLabel>
                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />
                <Link
                  href={"/forgot-password"}
                  className="text-left text-sm text-red-600"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full cursor-pointer p-6 text-center text-base leading-6 font-semibold transition-all duration-500"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log in
              </Button>
            </div>
          </form>
        </Form>

        <footer className="flex w-full flex-col items-center gap-3">
          <LoginPrompt callToAction="Don't have an account?" route="/sign-up" />
          <SeparatorMain />
          <div className="flex gap-3">
            <Google />
            <Facebook />
            <Apple />
          </div>
        </footer>
      </div>
    </section>
  );
}
