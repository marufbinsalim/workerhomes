import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const id = params.id

  if (!id) {
    return NextResponse.json('ERROR', { status: 400 })
  }

  try {
    const customer = await stripe.customers.retrieve(id)

    const defaultPaymentMethodId =
      customer?.invoice_settings?.default_payment_method

    if (!defaultPaymentMethodId) {
      return NextResponse.json({ ...customer }, { status: 200 })
    }

    const paymentMethod = await stripe?.paymentMethods?.retrieve(
      defaultPaymentMethodId
    )

    return NextResponse.json(
      { ...customer, payment_method: paymentMethod },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { data: [], error: error.message },
      { status: 400 }
    )
  }
}

export async function PUT(req, { params }) {
  const id = params?.id
  const { name, email, address } = await req.json()

  try {
    const customer = await stripe.customers.update(id, {
      email,
      name: name,
      address: {
        city: address?.city,
        country: address?.country,
        line1: address?.line1,
        line2: address?.line2,
        postal_code: address?.postal_code,
        state: address?.state,
      },
    })

    return NextResponse.json({ data: customer }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { data: [], error: error.message },
      { status: 400 }
    )
  }
}
