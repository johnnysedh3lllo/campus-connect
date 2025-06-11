import { NextRequest, NextResponse } from "next/server";
import { fetchCustomer } from "@/app/actions/supabase/customers";
import { stripe } from "@/lib/utils/stripe/stripe";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  try {
    const requestBody: { userId: string } = await request.json();
    const userId = requestBody.userId;

    if (!userId) {
      throw new Error(`UserId required to create Billing Portal Session`);
    }

    const customer = await fetchCustomer(userId);

    if (!customer) {
      throw new Error(
        `There was an error creating Billing Portal Session:
         Could not get the customer from Supabase`,
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.stripe_customer_id,
      return_url: `${referer ? referer : origin}`,
    });

    if (!portalSession) {
      throw new Error(
        `There was an error while creating a Billing Portal session:
         Something happened at actually portal session creation.
        `,
      );
    }
    return NextResponse.json({ url: portalSession.url }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong creating the Billing Portal Session" },
      { status: 500 },
    );
  }
}
