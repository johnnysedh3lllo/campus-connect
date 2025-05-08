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

// export const checkPaymentStatus = async (
//   sessionId: string,
//   setOpen: (value: boolean) => void,
// ) => {
//   try {
//     const response = await fetch("/api/verify-session", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ sessionId }),
//     });

//     const result = await response.json();

//     if (result.ok) {
//       setOpen(true);
//       console.info("✅ Payment verified for session:", sessionId);
//     } else {
//       console.warn(
//         "❌ Payment verification failed or returned unexpected result.",
//       );
//     }
//   } catch (err) {
//     console.error("⚠️ Error confirming payment:", err);
//   }
// };
