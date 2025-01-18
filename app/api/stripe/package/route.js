import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
  try {
    const data = await req.json()
    const stripePackage = await stripe.products.create({
      name: data?.name,
      description: data?.description,
      metadata: data?.roles,
      active: true,
      default_price_data: {
        currency: 'pln',
        unit_amount: data?.price * 100,
        recurring: { interval: 'month', interval_count: 1 },
      },
    })

    return NextResponse.json(stripePackage, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req, res) {
  try {
    const data = await req.json()

    // Update the product details
    const stripePackage = await stripe.products.update(data?.id, {
      name: data?.name,
      description: data?.description,
      metadata: data?.roles,
    })

    const productPrice = await stripe.prices.retrieve(data?.stripe_price_id)

    const oldPrice = (productPrice?.unit_amount / 100).toString()
    const newPrice = data?.price.toString()

    let createdPrice = null

    if (oldPrice !== newPrice) {
      // Create a new price object
      createdPrice = await stripe.prices.create({
        unit_amount: data?.price * 100, // price in smallest currency unit (e.g., cents for USD)
        currency: 'pln',
        product: data?.id,
        recurring: { interval: 'month', interval_count: 1 },
      })

      // Update the product to use the new price as the default
      await stripe.products.update(data?.id, {
        default_price: createdPrice.id,
      })

      // Optionally, deactivate the old prices
      const oldPrices = await stripe.prices.list({
        product: data?.id,
        active: true,
      })

      for (const oldPrice of oldPrices.data) {
        if (oldPrice.id !== createdPrice.id) {
          await stripe.prices.update(oldPrice.id, { active: false })
        }
      }
    }

    return NextResponse.json(
      { product: stripePackage, newPrice: createdPrice ? createdPrice : null },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
