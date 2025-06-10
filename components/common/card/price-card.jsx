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
    <div
      className="tw:bg-[#FAFBFC] tw:border tw:border-[#D8E0ED]  tw:p-4"
    >
      <p className="tw:font-semibold  tw:text-[#FF780B]">
        <span className="tw:text-[24px]"> ${price}{" "}</span>
        <span className="tw:text-[18px">
          / {generatedType}
        </span>
      </p>
      <p className="tw:text-[14px] tw:font-normal tw:mt-2 tw:text-[#797979]">
        Number of Guests:{" "}
        <span className="tw:font-medium tw:text-[#3B3B3B]">
          {guests}
        </span>
      </p>
      <p className="tw:text-[14px] tw:font-normal tw:mt-2 tw:text-[#797979]">
        Minimum Stay:{" "}
        <span className="tw:font-medium tw:text-[#3B3B3B]">
          {minStay}
        </span>
      </p>
    </div>
  )
}

export default PricingCard
