"use strict";
import { z } from "zod";

// FORM SCHEMAS
export const roleSchema = z.object({
  role: z.string(),
});

export const userDetailsFormSchema = z.object({
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
  newsletter: z.boolean().default(true).optional(),
});

export const otpFormSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

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
