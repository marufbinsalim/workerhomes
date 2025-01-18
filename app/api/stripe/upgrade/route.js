import { api, url } from '@/config'
import { stripe } from '@/lib/stripe'
import axios from 'axios'
import moment from 'moment'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
  try {
    const { customer, newSubscription, oldSubscription, state, locale } =
      await req.json()

    if (!oldSubscription?.stripe_subscription_id && oldSubscription?.isFree) {
      const oldStrapiSubscriptionId = oldSubscription?.id

      const session = await stripe.checkout.sessions.create({
        payment_method_collection: 'always',
        customer,
        line_items: [
          {
            price: newSubscription?.stripe_price_id,
            quantity: 1,
            // tax_rates: ['txr_1QFrIbDymaqQQyWQwpLrEv8W'], // Apply tax rates
          },
        ],
        mode: 'subscription',
        locale,
        success_url: `${url}/${locale}/dashboard/dwellings?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/${locale}/dashboard/dwellings`,
        metadata: { state, oldStrapiSubscriptionId },
        automatic_tax: { enabled: false },
      })

      return NextResponse.json({ id: session.id }, { status: 200 })
    }

    // Retrieve the current subscription
    const subscription = await stripe.subscriptions.retrieve(
      oldSubscription?.stripe_subscription_id
    )

    // Update the subscription for upgrade/downgrade
    const updatedSubscription = await stripe.subscriptions.update(
      oldSubscription?.stripe_subscription_id,
      {
        items: [
          {
            id: subscription?.items?.data?.[0]?.id, // Keep the same subscription item ID
            price: newSubscription?.stripe_price_id, // Update to the new plan
          },
        ],
        proration_behavior:
          state === 'downgrade' ? 'create_prorations' : 'always_invoice',
        cancel_at_period_end: false, // Prevent the subscription from canceling
        metadata: {
          ...subscription?.metadata,
          oldPlanId: subscription?.items?.data?.[0]?.price?.id,
          newPlanId: newSubscription?.stripe_price_id,
          state,
        },
      }
    )

    if (state === 'upgrade') {
      const current_period_end = updatedSubscription?.current_period_end
      const current_period_start = updatedSubscription?.current_period_start
      const invoice = await stripe.invoices.retrieve(
        updatedSubscription?.latest_invoice
      )

      await axios.put(`${api}/api/subscriptions/${oldSubscription?.id}`, {
        data: {
          package: newSubscription?.id,
          stripe_subscription_id: updatedSubscription?.id,
          stripe_price_id: newSubscription?.stripe_price_id,
          start_date: moment(current_period_start * 1000).format('YYYY-MM-DD'),
          end_date: moment(current_period_end * 1000).format('YYYY-MM-DD'),
          payment_currency: invoice?.currency,
          payment_amount: (invoice?.amount_paid / 100).toString(),
          payment_status: invoice?.status,
          stripe_current_period_start:
            updatedSubscription?.current_period_start?.toString(),
          stripe_current_period_end:
            updatedSubscription?.current_period_end?.toString(),
        },
      })
    }

    return NextResponse.json(
      { subscription: updatedSubscription },
      { status: 200 }
    )
  } catch (error) {
    if (error.response) {
      // Strapi error response is typically here
      console.error('Error Status:', error.response.status) // HTTP status code
      console.error('Error Data:', error.response.data?.error?.details?.errors) // Error details from Strapi
      console.error(
        'Error Message:',
        error.response.data.error?.message || 'Unknown error'
      )
    } else if (error.request) {
      // No response was received from the server
      console.error('No response received:', error.request)
    } else {
      // Something else went wrong in setting up the request
      console.error('Request Error:', error.message)
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
