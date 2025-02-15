"use strict";
import { z } from "zod";


// FORM SCHEMAS
export const roleSchema = z.object({
  role: z.string(),
});

export const userDetailsFormsSchema = z.object({
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
