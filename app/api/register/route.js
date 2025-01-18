import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
  try {
    const { email, first_name, last_name } = await req.json()
    const stripeCustomer = await stripe.customers.create({
      email,
      name: `${first_name} ${last_name}`,
    })
    return NextResponse.json(stripeCustomer, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
