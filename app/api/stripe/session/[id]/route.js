import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const id = params.id

  if (!id) {
    return NextResponse.json('ERROR', { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(id)

    // const subscription = await stripe.subscriptions.retrieve(
    //   session.subscription,
    //   {
    //     expand: ['latest_invoice.payment_intent.payment_method'],
    //   }
    // )

    // const user = await stripe.customers.update(session?.customer, {
    //   invoice_settings: {
    //     default_payment_method: subscription?.default_payment_method,
    //   },
    //   address: {
    //     line1: address?.line1,
    //     line2: address?.line2,
    //     city: address?.city,
    //     state: address?.state,
    //     postal_code: address?.postal_code,
    //     country: address?.country,
    //   },
    // })

    return NextResponse.json({ data: session }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { data: [], error: error.message },
      { status: 400 }
    )
  }
}
