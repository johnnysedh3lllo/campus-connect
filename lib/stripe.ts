import { User } from "@supabase/supabase-js";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

// export async function createPortalSession(
//   userId: User["id"] | undefined,
// ): Promise<string> {
//   const response = await fetch("/api/billing-portal", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userId }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to create billing portal session.");
//   }

//   const { url } = await response.json();
//   return url;
// }
