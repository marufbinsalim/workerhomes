'use client'

import { useState } from 'react'
import RatingFilter from './RatingFilter'
import { useTranslations } from 'next-intl'

const DropdownSelectBar = ({
  options,
  title,
  priceValue = { text: 'Price', value: 'Price', id: 0 },
  setPriceValue,
  setGuestNumber,
  guestValue = { text: 'Guests', value: 'Guests', id: 0 },
  setMinStayValue,
  minStayValue = { text: 'Minimum Stay', value: 'Minimum Stay', id: 0 },
}) => {
  const t = useTranslations('listings')
  const [amenitiesValue, setAmenitiesValue] = useState('Amenities')
  const [styleValue, setStyleValue] = useState('Style')

  const handlePriceValueChange = value => setPriceValue(value)
  const handleAmenitesValueChange = value => setAmenitiesValue(value)
  const handleStyleChange = value => setStyleValue(value)
  const handleGuestNumberChange = value => setGuestNumber(value)
  const handleMiniumStayChange = value => setMinStayValue(value)

  const dropdowns = [
    {
      label: t('filters.0.title'),
      title: 'Price',
      value: priceValue?.text,
      options: [
        { id: 0, text: t('filters.0.options.0'), value: 'ALL' },
        { id: 1, text: t('filters.0.options.1'), value: 'LOWER_THAN_500' },
        { id: 2, text: t('filters.0.options.2'), value: 'BETWEEN_500_AND_1000' },
        { id: 3, text: t('filters.0.options.3'), value: 'BETWEEN_1000_AND_2000' },
        { id: 4, text: t('filters.0.options.4'), value: 'BETWEEN_2000_AND_3000' },
        { id: 5, text: t('filters.0.options.5'), value: 'GREATER_THAN_3000' },
      ],
      onChange: handlePriceValueChange,
    },
    {
      label: t('filters.1.title'),
      title: 'Guests',
      value: guestValue?.text,
      options: [
        { id: 0, text: t('filters.1.options.0'), value: 'ALL' },
        { id: 1, text: t('filters.1.options.1'), value: 'LOWER_THAN_5' },
        { id: 2, text: t('filters.1.options.2'), value: 'BETWEEN_5_AND_10' },
        { id: 3, text: t('filters.1.options.3'), value: 'BETWEEN_10_AND_15' },
        { id: 4, text: t('filters.1.options.4'), value: 'GREATER_THAN_15' },
      ],
      onChange: handleGuestNumberChange,
    },
    {
      label: t('filters.2.title'),
      title: 'Minimum Stay',
      value: minStayValue?.text,
      options: [
        { id: 0, text: t('filters.2.options.0'), value: 'ALL' },
        { id: 1, text: t('filters.2.options.1'), value: 'LOWER_THAN_5' },
        { id: 2, text: t('filters.2.options.2'), value: 'BETWEEN_5_AND_10' },
        { id: 3, text: t('filters.2.options.3'), value: 'BETWEEN_10_AND_15' },
        { id: 4, text: t('filters.2.options.4'), value: 'GREATER_THAN_15' },
      ],
      onChange: handleMiniumStayChange,
    },
  ]

  return (
    <>
      {dropdowns.map((dropdown, index) => (
        <div key={index} className="tw:relative tw:inline-block tw:mr-6">
          <span className="tw:block tw:text-sm tw:font-medium tw:mb-2">
            {dropdown.label}
          </span>

          <div className="tw:relative">
            <button
              className="tw:flex tw:items-center tw:justify-between tw:w-48 tw:px-4 tw:py-2 tw:text-sm tw:border tw:border-gray-300 tw:rounded-full tw:bg-white tw:shadow-sm tw:focus:outline-none"
              onClick={(e) => {
                const target = e.currentTarget.nextSibling
                target.classList.toggle('tw:hidden')
              }}
            >
              <span>{dropdown.value}</span>
              <svg
                className="tw:w-4 tw:h-4 tw:ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div className="tw:absolute tw:z-10 tw:mt-2 tw:w-48 tw:bg-white tw:border tw:border-gray-200 tw:rounded-md tw:shadow-lg tw:hidden">
              <ul className="tw:py-2 tw:text-sm tw:text-gray-700">
                {dropdown.options.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => dropdown.onChange(item)}
                      className={`tw:w-full tw:text-left tw:px-4 tw:py-2 hover:tw:bg-gray-100 ${item?.value === dropdown.value
                          ? 'tw:text-blue-600 tw:font-semibold'
                          : ''
                        }`}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default DropdownSelectBar
