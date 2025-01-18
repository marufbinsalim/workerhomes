import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const id = params.id

  if (!id) {
    return NextResponse.json('ERROR', { status: 400 })
  }

  try {
    const invoices = await stripe.invoices.list({
      customer: id,
      limit: 12, // Fetch recent 12 invoices (customizable)
    })

    if (!invoices.data.length) {
      return NextResponse.json([], { status: 200 })
    }

    const detailedInvoices = await Promise.all(
      invoices.data.map(async invoice => {
        const lines = await stripe.invoices.retrieve(invoice.id, {
          expand: ['lines.data.price.product'], // Expanding to get product details
        })
        return { ...invoice, lines: lines.lines.data }
      })
    )

    return NextResponse.json({ data: detailedInvoices }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { data: [], error: error.message },
      { status: 400 }
    )
  }
}
