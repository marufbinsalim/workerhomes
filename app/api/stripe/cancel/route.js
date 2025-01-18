import { url } from '@/config'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function PUT(req, res) {
  try {
    const { subscriptionId } = await req.json()

    // Retrieve the subscription to check if it's managed by a schedule
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Check if the subscription has an associated schedule
    if (subscription.schedule) {
      // Retrieve the associated subscription schedule
      const schedule = await stripe.subscriptionSchedules.retrieve(
        subscription.schedule
      )

      // Check if the schedule is already set to cancel or is in the canceled state
      if (schedule.status === 'canceled') {
        return NextResponse.json(
          { message: 'Subscription schedule is already canceled' },
          { status: 200 }
        )
      }

      // Update the subscription schedule to cancel at the end of the current period
      const updatedSchedule = await stripe.subscriptionSchedules.update(
        subscription.schedule,
        { end_behavior: 'cancel' }
      )
      return NextResponse.json({ id: updatedSchedule.id }, { status: 200 })
    } else {
      // If no schedule, update the subscription directly to cancel at period end
      const prev_subscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: true,
        }
      )
      return NextResponse.json({ id: prev_subscription.id }, { status: 200 })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
