import { url } from '@/config'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

const CustomerCard = ({ customer, locale }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const t = useTranslations('payment-card')

  const handleSetupCustomerPortal = async () => {
    try {
      const { data } = await axios.post(`${url}/api/stripe/portal`, {
        customerId: customer,
        redirectUrl: `${url}/${locale}/dashboard/me`,
      })

      if (data?.url) {
        window.location.href = data.url // Redirect to the Customer Portal
      } else {
        console.error('Failed to create portal session:', data.error)
        setError(t('unable'))
      }
    } catch (err) {
      console.error(err.message)
      setError(t('failed'))
    }
  }

  const getCustomer = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${url}/api/stripe/customer/${customer}`)

      setData(data)
    } catch (err) {
      console.error(err.message)
      setError(t('retrieve-error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCustomer()
  }, [])

  const renderPaymentDetails = () => {
    const { payment_method: paymentMethod } = data || {}

    if (!paymentMethod) {
      return <p>{t('no-method')}</p>
    }

    const { type, card, paypal, link } = paymentMethod

    if (type === 'card' && card) {
      return (
        <>
          <p className='card-text d-flex justify-content-between align-items-center'>
            <strong>{t('type')}</strong> Card
          </p>
          <p className='card-text d-flex justify-content-between align-items-center'>
            <strong>{t('brand')}</strong> {card?.brand?.toUpperCase()}
          </p>
          <p className='card-text d-flex justify-content-between align-items-center'>
            <strong>{t('last4')}</strong> **** **** **** {card?.last4}
          </p>
          <p className='card-text d-flex justify-content-between align-items-center'>
            <strong>{t('expiry')}</strong> {card?.exp_month}/{card?.exp_year}
          </p>
        </>
      )
    }

    if (type === 'paypal' && paypal) {
      return (
        <>
          <p className='card-text d-flex justify-content-between align-items-center'>
            <strong>{t('type')}</strong> PayPal
          </p>
          <p className='card-text d-flex justify-content-between align-items-center'>
            <strong>{t('email')}</strong> {paypal?.email || 'N/A'}
          </p>
        </>
      )
    }

    if (type === 'link' && link) {
      return (
        <>
          <p className='card-text d-flex justify-content-between align-items-center'>
            <strong>{t('type')}</strong> Link
          </p>
          <p className='card-text d-flex justify-content-between align-items-center'>
            <strong>{t('email')}</strong> {link?.email || 'N/A'}
          </p>
        </>
      )
    }

    return <p>{t('un-support')}</p>
  }

  return (
    <div className='d-flex justify-content-between align-items-center'>
      <div
        className='card px-10 w-fit-content'
        style={{ height: 'fit-content', minWidth: '400px' }}
      >
        {loading ? (
          <p className='text-center mt-4'>{t('loading')}</p>
        ) : error ? (
          <div className='text-danger text-center mt-4'>{error}</div>
        ) : (
          <div className='card-body'>
            {/* <p className='card-text d-flex justify-content-between align-items-center'>
              <strong>{t('customer')}</strong> {data?.id || 'N/A'}
            </p>
            <hr /> */}
            {renderPaymentDetails()}
          </div>
        )}
      </div>
      <div>
        {!loading && (
          <button
            className='button -sm bg-blue-1 text-white w-100 '
            onClick={handleSetupCustomerPortal}
            disabled={loading}
          >
            {data?.payment_method ? t('update') : t('setup')}
          </button>
        )}
      </div>
    </div>
  )
}

export default CustomerCard
