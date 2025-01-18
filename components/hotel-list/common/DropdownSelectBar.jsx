'use client'

import { useState } from 'react'
import RatingFilter from './RatingFilter'
import { useTranslations } from 'next-intl'

const DropdownSelectBar = ({
  options,
  title,
  priceValue = {
    text: 'Price',
    value: 'Price',
    id: 0,
  },
  setPriceValue,
  setGuestNumber,
  guestValue = {
    text: 'Guests',
    value: 'Guests',
    id: 0,
  },
  setMinStayValue,
  minStayValue = {
    text: 'Minimum Stay',
    value: 'Minimum Stay',
    id: 0,
  },
}) => {
  const t = useTranslations('listings')
  const [amenitiesValue, setAmenitiesValue] = useState('Amenities')
  const [styleValue, setStyleValue] = useState('Style')

  const handlePriceValueChange = value => {
    setPriceValue(value)
  }

  const handleAmenitesValueChange = value => {
    setAmenitiesValue(value)
  }

  const handleStyleChange = value => {
    setStyleValue(value)
  }

  const handleGuestNumberChange = value => {
    setGuestNumber(value)
  }

  const handleMiniumStayChange = value => {
    setMinStayValue(value)
  }

  const dropdowns = [
    {
      label: t('filters.0.title'),
      title: 'Price',
      value: priceValue?.text,
      options: [
        {
          id: 0,
          text: t('filters.0.options.0'),
          value: 'ALL',
        },
        {
          id: 1,
          text: t('filters.0.options.1'),
          value: 'LOWER_THAN_500',
        },
        {
          id: 2,
          text: t('filters.0.options.2'),
          value: 'BETWEEN_500_AND_1000',
        },
        {
          id: 3,
          text: t('filters.0.options.3'),
          value: 'BETWEEN_1000_AND_2000',
        },
        {
          id: 4,
          text: t('filters.0.options.4'),
          value: 'BETWEEN_2000_AND_3000',
        },
        {
          id: 5,
          text: t('filters.0.options.5'),
          value: 'GREATER_THAN_3000',
        },
      ],
      onChange: handlePriceValueChange,
    },
    {
      label: t('filters.1.title'),
      title: 'Guests',
      value: guestValue?.text,
      options: [
        {
          id: 0,
          text: t('filters.1.options.0'),
          value: 'ALL',
        },
        {
          id: 1,
          text: t('filters.1.options.1'),
          value: 'LOWER_THAN_5',
        },
        {
          id: 2,
          text: t('filters.1.options.2'),
          value: 'BETWEEN_5_AND_10',
        },
        {
          id: 3,
          text: t('filters.1.options.3'),
          value: 'BETWEEN_10_AND_15',
        },
        {
          id: 4,
          text: t('filters.1.options.4'),
          value: 'GREATER_THAN_15',
        },
      ],
      onChange: handleGuestNumberChange,
    },
    {
      label: t('filters.2.title'),
      title: 'Minimum Stay',
      value: minStayValue?.text,
      options: [
        {
          id: 0,
          text: t('filters.2.options.0'),
          value: 'ALL',
        },
        {
          id: 1,
          text: t('filters.2.options.1'),
          value: 'LOWER_THAN_5',
        },
        {
          id: 2,
          text: t('filters.2.options.2'),
          value: 'BETWEEN_5_AND_10',
        },
        {
          id: 3,
          text: t('filters.2.options.3'),
          value: 'BETWEEN_10_AND_15',
        },
        {
          id: 4,
          text: t('filters.2.options.4'),
          value: 'GREATER_THAN_15',
        },
      ],
      onChange: handleMiniumStayChange,
    },
  ]

  const [selectedValues, setSelectedValues] = useState([])

  return (
    <>
      {dropdowns.map((dropdown, index) => (
        <div className='col-auto' key={index}>
          <span className='mr-10'>{dropdown?.label}</span>

          <div className='dropdown js-dropdown js-amenities-active'>
            <div
              className='dropdown__button d-flex items-center text-14 rounded-100 border-light px-15 h-34'
              data-bs-toggle='dropdown'
              data-bs-auto-close='true'
              aria-expanded='false'
              data-bs-offset='0,10'
            >
              <span className='js-dropdown-title'>{dropdown.value}</span>
              <i className='icon icon-chevron-sm-down text-7 ml-10' />
            </div>
            {/* End dropdown__button */}

            <div className='toggle-element -dropdown js-click-dropdown dropdown-menu'>
              <div className='text-15 y-gap-15 js-dropdown-list'>
                {dropdown.options.map((item, index) => {
                  return (
                    <div key={index}>
                      <button
                        className={`${
                          item?.value === dropdown.value ? 'text-blue-1 ' : ''
                        }d-block js-dropdown-link`}
                        onClick={() => dropdown.onChange(item)}
                      >
                        {item?.text}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* End dropdown-menu */}
          </div>
          {/* End dropdown */}
        </div>
      ))}
    </>
  )
}

export default DropdownSelectBar
