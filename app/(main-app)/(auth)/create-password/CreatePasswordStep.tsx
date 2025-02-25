import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage as FormErrorMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/app/password-input";
import { Button } from "@/components/ui/button";
import { CreatePasswordStepProps } from "@/lib/types.";

// Component definitions
const CreatePasswordStep: React.FC<CreatePasswordStepProps> = ({
  form,
  isSubmitting,
  onSubmit,
}) => (
  <div className="flex flex-col justify-center gap-6 sm:gap-12 lg:max-w-120">
    <section className="flex flex-col gap-2">
      <h1 className="text-xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
        Create Password
      </h1>
      <p className="text text-secondary-foreground text-sm">
        Enter a password you can remember, to secure your account
      </p>
    </section>

    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6 sm:gap-12">
        <div className="flex flex-col gap-6 sm:px-2">
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="flex flex-col gap-1 text-sm leading-6 font-medium">
                    Password
                    <FormControl>
                      <PasswordInput
                        disabled={isSubmitting}
                        required
                        placeholder="Enter password"
                        field={field}
                      />
                    </FormControl>
                  </FormLabel>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="flex flex-col gap-1 text-sm leading-6 font-medium">
                  Confirm Password
                  <FormControl>
                    <PasswordInput
                      disabled={isSubmitting}
                      required
                      placeholder="Confirm password"
                      field={field}
                    />
                  </FormControl>
                </FormLabel>
                <FormErrorMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={isSubmitting}
          type="submit"
          className="w-full cursor-pointer p-6 text-base leading-6 font-semibold transition-all duration-300"
        >
          {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
          Create Password
        </Button>
      </form>
    </Form>
  </div>
);

export default CreatePasswordStep;
