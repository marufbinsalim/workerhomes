'use client'

import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// Import locales from date-fns
import { registerLocale } from 'react-datepicker'
import enGB from 'date-fns/locale/en-GB'
import pl from 'date-fns/locale/pl'
import de from 'date-fns/locale/de'

// Register locales for react-datepicker
registerLocale('en', enGB)
registerLocale('pl', pl)
registerLocale('de', de)

// Locale mapping
const localeMap = {
  en: enGB,
  pl: pl,
  de: de,
}

const DatePickerComponent = ({ locale }) => {
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange

  const handleDateRangeChange = dates => {
    setDateRange(dates)
  }

  return (
    <div className='date-picker'>
      <DatePicker
        selected={startDate}
        onChange={handleDateRangeChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        placeholderText='Select date range'
        isClearable={true}
        // Set locale for datepicker
        locale={localeMap[locale] || 'en'} // Default to 'en' if locale not found
      />
    </div>
  )
}

export default DatePickerComponent
