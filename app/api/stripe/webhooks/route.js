import { api, url } from '@/config'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import axios from 'axios'
import { buffer } from 'micro'
import moment from 'moment'
import { getServerSession } from 'next-auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import QueryString from 'qs'

const endPointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req, res) {
  const body = await req.text()
  const sig = headers().get('Stripe-Signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    if (!sig || !webhookSecret) return
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error(`❌ Error message: ${err.message}`)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  const { type } = event
  // Handle the event
  try {
    switch (type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event)
        break
      case 'payment_intent.created':
        await handlePaymentIntentCreated(event)
        break
      case 'invoice.paid':
        await handleInvoicePaymentPaid(event)
        break
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event)
        break
      default:
        console.log(`Unhandled event type ${type}`)
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook handler failed. View logs.' },
      { status: 400 }
    )
  }
  return NextResponse.json({ received: true }, { status: 200 })
}

const handleSubscriptionCreated = async event => {
  const subscription = event.data.object

  const oneMonthLater = new Date()
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

  const current_period_end = subscription?.current_period_end
  const current_period_start = subscription?.current_period_start

  const formattedData = {
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    stripe_current_period_start: subscription?.current_period_start?.toString(),
    stripe_current_period_end: subscription?.current_period_end?.toString(),
    start_date: moment(current_period_start * 1000).format('YYYY-MM-DD'),
    end_date: moment(current_period_end * 1000).format('YYYY-MM-DD'),
    stripe_product_id: subscription?.plan?.product,
    payment_status: subscription?.status,
  }

  // Update your Strapi backend
  try {
    const res = await axios.post(`${api}/api/subscriptions`, {
      data: { ...formattedData },
    })

    return res
  } catch (error) {
    console.error(error?.response ? error.response.data : error.message)
  }
}

const handleSubscriptionUpdated = async event => {
  const subscription = event.data.object

  const oneMonthLater = new Date()
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

  const current_period_end = subscription?.current_period_end
  const current_period_start = subscription?.current_period_start

  const formattedData = {
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    stripe_current_period_start: subscription?.current_period_start?.toString(),
    stripe_current_period_end: subscription?.current_period_end?.toString(),
    start_date: moment(current_period_start * 1000).format('YYYY-MM-DD'),
    end_date: moment(current_period_end * 1000).format('YYYY-MM-DD'),
    stripe_product_id: subscription?.plan?.product,
    payment_status: subscription?.status,
  }

  // Update your Strapi backend
  try {
    const { data } = await axios.get(
      `${api}/api/subscriptions?${QueryString.stringify(
        {
          filters: {
            stripe_subscription_id: {
              $eq: subscription.id,
            },
          },
        },
        {
          encodeValuesOnly: true,
        }
      )}`
    )

    const subscriptionId = data?.data?.[0]?.id

    await axios.put(`${api}/api/subscriptions/${subscriptionId}`, {
      data: {
        ...formattedData,
      },
    })
  } catch (error) {
    console.log(error?.response ? error.response.data : error.message)
  }
}

const handleSubscriptionDeleted = async event => {
  const subscription = event.data.object

  // Extract necessary data
  // const subscriptionId = subscription.id

  // Update your Strapi backend
  // await axios.delete(
  //   `${process.env.STRAPI_API_URL}/subscriptions/${subscriptionId}`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  //     },
  //   }
  // )
}

const handleCheckoutSessionCompleted = async event => {
  const session = event.data.object

  try {
    const subscriptionId = session?.subscription
    const oldSubscriptionId = session?.metadata?.oldSubscription
    const state = session?.metadata?.state
    const oldStrapiSubscriptionId = session?.metadata?.oldStrapiSubscriptionId

    if (oldSubscriptionId || state) {
      await axios.post(`${api}/api/pending-subscriptions`, {
        data: {
          prev_strapi_subscription: oldStrapiSubscriptionId || null,
          prev_subscription: oldSubscriptionId || null,
          new_subscription: subscriptionId,
          dwelling: session?.metadata?.dwelling || null,
          isSynced: false,
          customer: session?.customer,
          state,
        },
      })
    }

    const redirectUrl = `${url}/${session?.locale}/dashboard/dwellings/form?session_id=${session.id}&subscription=${subscriptionId}`
    return NextResponse.redirect(new URL(redirectUrl))
  } catch (error) {
    console.log(error?.response ? error.response.data : error.message)
  }
}

const handlePaymentIntentCreated = async event => {
  const intent = event.data.object
}

const handleInvoicePaymentSucceeded = async event => {
  const invoice = event.data.object

  let paymentAmountPLN = invoice?.amount_paid / 100 // Convert from grosz to PLN

  try {
    const { data } = await axios.get(
      `${api}/api/subscriptions?${QueryString.stringify(
        {
          filters: {
            stripe_subscription_id: {
              $eq: invoice?.subscription,
            },
          },
        },
        {
          encodeValuesOnly: true,
        }
      )}`
    )

    const subscriptionId = data?.data?.[0]?.id

    const res = await axios.put(`${api}/api/subscriptions/${subscriptionId}`, {
      data: {
        payment_amount: paymentAmountPLN?.toString(),
        payment_status: invoice?.status,
        payment_currency: invoice?.currency,
        stripe_tracking_id: invoice?.payment_intent,
      },
    })
  } catch (error) {
    console.log(error?.response ? error.response.data : error.message)
  }
}

const handleInvoicePaymentPaid = async event => {
  const invoice = event.data.object

  try {
    const { data } = await axios.get(
      `${api}/api/pending-subscriptions?filters[new_subscription][$eq]=${invoice.subscription}&filters[isSynced][$eq]=false&filters[customer][$eq]=${invoice.customer}`
    )

    const pendingSubscription = data?.data?.[0] || null

    if (pendingSubscription?.id) {
      if (pendingSubscription?.state === 'upgrade') {
        await axios.put(`${api}/api/upgrade-package`, {
          data: {
            invoice,
          },
        })
      } else if (pendingSubscription?.state === 'downgrade') {
        await axios.put(`${api}/api/downgrade-package`, {
          data: {
            invoice,
          },
        })
      }
    }
  } catch (error) {
    console.log(error?.response ? error.response.data : error.message)
  }
}
