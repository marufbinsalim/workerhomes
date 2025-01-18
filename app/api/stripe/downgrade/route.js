import { api, url } from '@/config'
import { stripe } from '@/lib/stripe'
import axios from 'axios'
import moment from 'moment'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
  try {
    const { customer, newSubscription, oldSubscription, state, locale } =
      await req.json()

    // Retrieve the current subscription
    const subscription = await stripe.subscriptions.retrieve(
      oldSubscription?.stripe_subscription_id
    )

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    const currentPeriodEnd = subscription?.current_period_end
    const currentPeriodStart = subscription?.current_period_start

    // Check if the subscription has an associated schedule
    let phases = null

    if (!subscription.schedule) {
      // Create a new subscription schedule
      const newSchedule = await stripe.subscriptionSchedules.create({
        from_subscription: subscription?.id, // Link to the current subscription
      })

      // Define the phases for the new subscription schedule
      phases = await stripe.subscriptionSchedules.update(newSchedule.id, {
        end_behavior: 'release', // Release the subscription at the end of the current period
        proration_behavior: 'always_invoice',
        phases: [
          {
            start_date: currentPeriodStart,
            end_date: currentPeriodEnd,
            automatic_tax: { enabled: false },
            items: [
              {
                price: subscription?.items?.data?.[0]?.price?.id, // ID of the current price
                quantity: 1,
                tax_rates: ['txr_1QFrIbDymaqQQyWQwpLrEv8W'], // Apply the 21% tax rate
              },
            ],
          },
          {
            start_date: currentPeriodEnd,
            automatic_tax: { enabled: false },
            items: [
              {
                price: newSubscription?.stripe_price_id, // ID of the new price for the new subscription
                quantity: 1,
                tax_rates: ['txr_1QFrIbDymaqQQyWQwpLrEv8W'], // Apply the 21% tax rate
              },
            ],
          },
        ],
      })
    } else {
      phases = await stripe.subscriptionSchedules.retrieve(
        subscription.schedule
      )
    }

    // If the new schedule was successfully created, update the database
    if (phases?.id) {
      await axios.post(`${api}/api/subscriptions`, {
        data: {
          stripe_subscription_id: oldSubscription?.stripe_subscription_id,
          stripe_price_id: newSubscription?.stripe_price_id,
          user: oldSubscription?.user?.id,
          start_date: moment(currentPeriodEnd * 1000).format('YYYY-MM-DD'),
          end_date: moment(currentPeriodEnd * 1000)
            .add(1, 'month')
            .format('YYYY-MM-DD'),
          stripe_current_period_start: currentPeriodEnd?.toString(),
          stripe_current_period_end: '',
          stripe_customer_id: customer,
          payment_amount: newSubscription?.price?.toString(),
          payment_currency: 'pln',
          stripe_product_id: newSubscription?.stripe_product_id,
          payment_status: 'draft',
          parent_subscription: oldSubscription?.id,
        },
      })
    }

    return NextResponse.json({ phases }, { status: 200 })
  } catch (error) {
    if (error.response) {
      console.error('Error Status:', error.response.status)
      console.error('Error Data:', error.response)
      console.error(
        'Error Message:',
        error.response.data.error?.message || 'Unknown error'
      )
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Request Error:', error.message)
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// import { api, url } from '@/config'
// import { stripe } from '@/lib/stripe'
// import axios from 'axios'
// import moment from 'moment'
// import { NextResponse } from 'next/server'

// export async function POST(req, res) {
//   try {
//     const { customer, newSubscription, oldSubscription, state, locale } =
//       await req.json()

//     // Retrieve the current subscription
//     const subscription = await stripe.subscriptions.retrieve(
//       oldSubscription?.stripe_subscription_id
//     )

//     if (!subscription) {
//       return NextResponse.json(
//         { error: 'Subscription not found' },
//         { status: 404 }
//       )
//     }

//     const currentPeriodEnd = subscription?.current_period_end
//     const currentPeriodStart = subscription?.current_period_start

//     // Create a subscription schedule
//     const schedule = await stripe.subscriptionSchedules.create({
//       from_subscription: subscription?.id, // Link to current subscription
//     })

//     // Update the current subscription to cancel at the end of the period
//     const phases = await stripe.subscriptionSchedules.update(schedule.id, {
//       end_behavior: 'release',
//       phases: [
//         {
//           start_date: currentPeriodStart,
//           end_date: currentPeriodEnd,
//           items: [
//             {
//               price: subscription?.items?.data?.[0]?.price?.id, // ID of the current price
//             },
//           ],
//         },
//         {
//           start_date: currentPeriodEnd,
//           items: [
//             {
//               price: newSubscription?.stripe_price_id, // ID of the new price to downgrade/upgrade
//               quantity: 1,
//               // tax_rates: ['txr_1QFrIbDymaqQQyWQwpLrEv8W'], // Apply the 21% tax rate
//             },
//           ],
//           // automatic_tax: { enabled: false },
//         },
//       ],
//     })

//     if (schedule?.id) {
//       await axios.post(`${api}/api/subscriptions`, {
//         stripe_subscription_id: oldSubscription?.stripe_subscription_id,
//         stripe_price_id: newSubscription?.id,
//         stripe_subscription_schedule_id: schedule?.id,
//         user: oldSubscription?.user,
//         start_date: moment(currentPeriodEnd * 1000).format('YYYY-MM-DD'),
//         end_date: moment(currentPeriodEnd * 1000)
//           .add(1, 'month')
//           .format('YYYY-MM-DD'),
//         stripe_current_period_start: currentPeriodEnd,
//         stripe_current_period_end: '',
//         stripe_customer_id: customer,
//         payment_amount: newSubscription?.amount,
//         payment_currency: 'pln',
//         stripe_product_id: newSubscription?.stripe_product_id,
//         payment_status: 'draft',
//         parent_subscription: oldSubscription?.id,
//       })
//     }

//     return NextResponse.json({ schedule, phases }, { status: 200 })
//   } catch (error) {
//     if (error.response) {
//       // Strapi error response is typically here
//       console.error('Error Status:', error.response.status) // HTTP status code
//       console.error('Error Data:', error.response.data?.error?.details?.errors) // Error details from Strapi
//       console.error(
//         'Error Message:',
//         error.response.data.error?.message || 'Unknown error'
//       )
//     } else if (error.request) {
//       // No response was received from the server
//       console.error('No response received:', error.request)
//     } else {
//       // Something else went wrong in setting up the request
//       console.error('Request Error:', error.message)
//     }
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }
