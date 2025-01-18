import { api, url } from '@/config'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
  try {
    const { customerId, redirectUrl } = await req.json()

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: redirectUrl, // URL to redirect users after they exit the portal
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
