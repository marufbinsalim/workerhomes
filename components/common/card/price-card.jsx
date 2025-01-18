'use client'

import { getCurrency, getExchange } from '@/lib/services/currency'
import { getType } from '@/utils'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const PricingCard = ({ price, minStay, type, adults, guests, amountNote }) => {
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState(0)
  const locale = useParams().locale
  const t = useTranslations('dwelling-card')
  // const currency = getCurrency(locale)

  // const handleUpdateAmount = async amount => {
  //   const data = await getExchange('PLN', currency, amount)
  //   setAmount(data?.convertedAmount)
  // }

  // useEffect(() => {
  //   handleUpdateAmount(price)
  // }, [locale])

  const generatedType = getType(locale, type)

  return (
    <div className='pricing-card'>
      <div className='pricing-card-header'>
        <h6>{t('per-night')}</h6>
        <p className='price'>{price} zł</p>
      </div>
      <div className='pricing-card-body '>
        <p className='d-flex justify-content-between align-items-center'>
          {t('min-stay')}:{' '}
          <span className='badge'>
            {minStay} {t('per-night')}
          </span>
        </p>
        <p className='d-flex justify-content-between align-items-center'>
          {t('guests')}: <span className='badge'>{guests}</span>
        </p>
      </div>
      <div className='pricing-card-footer text-brand'>
        <h6>{generatedType}</h6>
      </div>
    </div>
  )
}

export default PricingCard
