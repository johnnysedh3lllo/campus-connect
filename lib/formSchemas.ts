"use strict";

import { z } from "zod";

// FORM SCHEMAS
const RoleEnum = z.enum(["1", "2", "3"]);
export type RoleType = z.infer<typeof RoleEnum>;

export const userValidationSchema = z.object({
  roleId: RoleEnum.describe("User role selection"),
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
});

export type UserValidationSchema = z.infer<typeof userValidationSchema>;

// SIGN UP ACTION
export const signUpDataSchema = userValidationSchema.pick({
  firstName: true,
  lastName: true,
  emailAddress: true,
  roleId: true,
  newsletter: true,
});

// SIGN UP FORM STEPS
export const roleSchema = userValidationSchema.pick({
  roleId: true,
});
export type RoleSchema = z.infer<typeof roleSchema>;

export const userDetailsFormSchema = signUpDataSchema.omit({
  roleId: true,
});
export type UserDetailsFormSchema = z.infer<typeof userDetailsFormSchema>;

export const otpFormSchema = userValidationSchema.pick({
  otp: true,
});
export type OtpFormSchema = z.infer<typeof otpFormSchema>;

export const setPasswordFormSchema = userValidationSchema
  .pick({
    password: true,
    confirmPassword: true,
  })
  .refine(
    (data) =>
      !data.password ||
      !data.confirmPassword ||
      data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );
export type SetPasswordFormSchema = z.infer<typeof setPasswordFormSchema>;

// LOGIN FORM
export const loginSchema = userValidationSchema.pick({
  emailAddress: true,
  password: true,
});

export const resetPasswordEmailSchema = userValidationSchema.pick({
  emailAddress: true,
});
