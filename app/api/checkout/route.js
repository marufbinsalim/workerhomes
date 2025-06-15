import { url } from "@/config";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { item, user, dwelling, locale, methods } = await req.json();

    const redirectUrl = `${url}/${locale}/dashboard/dwellings`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      payment_method_collection: "always",
      line_items: [
        {
          price: item?.stripe_price_id,
          quantity: 1,
        },
      ],
      metadata: { dwelling },

      mode: "subscription",
      customer: user,
      locale: locale,
      success_url: redirectUrl,
      cancel_url: `${url}/${locale}/dashboard/dwellings/form/${dwelling}?step=4`,
    });

    return NextResponse.json({ id: session.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
