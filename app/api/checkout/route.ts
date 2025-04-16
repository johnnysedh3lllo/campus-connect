import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: NextRequest) {
  // const
  try {
    const requestBody = await request.json();

    console.log(requestBody);
  } catch (error) {}
}
