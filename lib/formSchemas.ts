"use strict";
import { z } from "zod";

// FORM SCHEMAS
export const multiStepFormSchema = z.object({
  roleId: z.string(),
  firstName: z
    .string()
    .nonempty({ message: "This is a required field" })
    .min(2, { message: "First name must be at least 2 characters long." }),
  lastName: z
    .string()
    .nonempty({ message: "This is a required field" })
    .min(2, { message: "Last name must be at least 2 characters long." }),
  emailAddress: z
    .string()
    .nonempty({ message: "This is a required field" })
    .email({ message: "Please enter a valid email address." }),
  newsletter: z.boolean().default(false).optional(),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type multiStepFormSchema = z.infer<typeof multiStepFormSchema>;

// to be incorporated into the multiStepFormSchema so as to enable the
// [schema].pick({}) pattern in order to reduce redundancy.
export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
      ),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// to use the [schema].pick({}) pattern
export const loginSchema = z.object({
  emailAddress: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })

  export const roleSchema = multiStepFormSchema.pick({
  roleId: true,
});

export const userDetailsFormSchema = multiStepFormSchema.pick({
  firstName: true,
  lastName: true,
  emailAddress: true,
  newsletter: true,
});

export const otpFormSchema = multiStepFormSchema.pick({
  otp: true,
});
