import { url } from '@/config'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
  try {
    const { item, user, dwelling, locale, methods } = await req.json()

    const redirectUrl = dwelling
      ? `${url}/${locale}/dashboard/dwellings/form/${dwelling}?subscription={CHECKOUT_SESSION_ID}&step=4`
      : `${url}/${locale}/dashboard/dwellings/form?session_id={CHECKOUT_SESSION_ID}&step=4`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      payment_method_collection: 'always',
      line_items: [
        {
          price: item?.stripe_price_id,
          quantity: 1,
          // tax_rates: ['txr_1QFrIbDymaqQQyWQwpLrEv8W'], // Apply the 21% tax rate
        },
      ],
      metadata: { dwelling },
      // billing_address_collection: 'required',
      // shipping_address_collection: {
      //   allowed_countries: ['PL', 'DE', 'GB'],
      // },

      mode: 'subscription',
      customer: user,
      locale: locale,
      success_url: redirectUrl,
      cancel_url: `${url}/${locale}/dashboard/dwellings/form/${dwelling}?step=4`,
      // automatic_tax: { enabled: false },
    })

    return NextResponse.json({ id: session.id }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
