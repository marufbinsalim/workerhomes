import { api, url } from '@/config'
import axios from 'axios'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'
import ConfirmModal from './ConfirmModal'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function UpgradePlanButton({
  subscription,
  dwelling,
  state,
  onSuccess,
  title = '',
}) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const t = useTranslations('upgrade')
  const locale = useParams().locale

  const handleUpgrade = async () => {
    setLoading(true)

    const stripe = await stripePromise

    try {
      const response = await axios.post(`${url}/api/stripe/upgrade`, {
        newSubscription: subscription,
        oldSubscription: dwelling?.subscription,
        customer: session?.stripe_customer_id,
        state,
        locale,
      })

      if (response?.status === 200 && response?.data?.subscription?.id) {
        toast.success(t('message'))
        return onSuccess && onSuccess()
      }

      const result = await stripe?.redirectToCheckout({
        sessionId: response?.data?.id,
      })

      if (result?.error) {
        console.error(result.error.message)
      }
    } catch (error) {
      console.error('Error upgrading plan:', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDowngradeToFree = async () => {
    setLoading(true)

    const stripe = await stripePromise

    try {
      if (dwelling?.subscription?.stripe_subscription_id) {
        await axios.put(`${url}/api/stripe/cancel`, {
          subscriptionId: dwelling?.subscription?.stripe_subscription_id,
        })
      }

      const response = await axios.put(`${api}/api/downgrade-package`, {
        data: {
          isFree: true,
          prev_subscription: dwelling?.subscription?.id?.toString(),
          user: session?.id?.toString(),
        },
      })

      if (response?.status === 200 || response?.status === 201) {
        onSuccess && onSuccess()
        toast.success(t('message'))
      }
    } catch (error) {
      console.error('Error downgrading plan:', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDowngrade = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${url}/api/stripe/downgrade`, {
        newSubscription: subscription,
        oldSubscription: dwelling?.subscription,
        customer: session?.stripe_customer_id,
        state,
        locale,
      })

      if (response?.status === 200 && response?.data?.phases?.id) {
        toast.success(t('message'))
        return onSuccess && onSuccess()
      }

      const result = await stripe?.redirectToCheckout({
        sessionId: response?.data?.id,
      })

      if (result?.error) {
        console.error(result.error.message)
      }
    } catch (error) {
      console.error('Error upgrading plan:', error)
      toast.error(error?.response?.data?.error || 'Unknown error')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleFunction = async () => {
    if (state === 'downgrade' && subscription?.isFree) {
      await handleDowngradeToFree()
    } else if (state === 'downgrade' && !subscription?.isFree) {
      await handleDowngrade()
    } else {
      await handleUpgrade()
    }
  }
  return (
    <>
      <button
        className='button -sm bg-blue-1 text-white '
        onClick={() => {
          setOpen(true)
        }}
        disabled={loading}
      >
        {loading
          ? t('process')
          : state === 'upgrade'
          ? t('upgrade')
          : t('downgrade')}
      </button>

      <ConfirmModal
        absolute
        btnSm
        title={
          state === 'upgrade'
            ? t('confirm.upgrade.title')
            : t('confirm.downgrade.title')
        }
        message={`${
          state === 'upgrade'
            ? t('confirm.upgrade.text')
            : t('confirm.downgrade.text')
        } ${title} ${
          state === 'upgrade'
            ? t('confirm.upgrade.text2')
            : t('confirm.downgrade.text2')
        }`}
        open={open}
        onCancel={value => {
          setOpen(false)
        }}
        onSuccess={handleFunction}
        isLoading={loading}
      />
    </>
  )
}

export default UpgradePlanButton
