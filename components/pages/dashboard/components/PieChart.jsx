'use client'

import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { Icon } from '@iconify/react'
import 'moment/locale/pl' // Import Polish locale
import 'moment/locale/de' // Import German locale
import { pl } from 'date-fns/locale/pl'
import { de } from 'date-fns/locale/de'
import { enGB } from 'date-fns/locale/en-GB'
import { useTranslations } from 'next-intl'
import Link from '@/components/common/Link'

registerLocale('pl', pl)
registerLocale('en', enGB)
registerLocale('de', de)

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Chart options
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false,
    },
  },
}

// Function to transform raw data into required format
const transformData = (rawData, startDate, endDate) => {
  if (!rawData || !Array.isArray(rawData)) {
    return { Platinum: 0, Silver: 0, Gold: 0, Free: 0 }
  }

  const transformedData = { Platinum: 0, Silver: 0, Gold: 0, Free: 0 }

  rawData.forEach(entry => {
    const entryStartDate = moment(entry.start_date)
    const entryEndDate = moment(entry.end_date)
    const packageName = entry.package?.name || 'Free'

    // Filter data based on selected dates
    if (
      (!startDate || entryStartDate.isSameOrAfter(startDate)) &&
      (!endDate || entryEndDate.isSameOrBefore(endDate))
    ) {
      if (packageName === 'Platinum') {
        transformedData.Platinum++
      } else if (packageName === 'Silver') {
        transformedData.Silver++
      } else if (packageName === 'Gold') {
        transformedData.Gold++
      } else if (packageName === 'Free') {
        transformedData.Free++
      }
    }
  })

  return transformedData
}

// Function to get chart data
const getChartData = (data, t) => {
  return {
    labels: [
      t('options.platinum'),
      t('options.silver'),
      t('options.gold'),
      t('options.free'),
    ],
    datasets: [
      {
        label: '%',
        data: [data.Platinum, data.Silver, data.Gold, data.Free],
        backgroundColor: ['#1967d2', '#c0c0c0', '#ffd700', '#fd6900'],
        hoverOffset: 4,
      },
    ],
  }
}

// Main Chart Component
const ChartMain = ({ rawData, label, locale = 'en' }) => {
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const t = useTranslations('plan')

  // Set moment locale based on selected locale
  moment.locale(locale)

  const transformedData = transformData(rawData, startDate, endDate)
  const chartData = getChartData(transformedData, t)

  const handleDateRangeChange = dates => {
    setDateRange(dates)
  }

  return (
    <div style={{ width: '100%', height: '500px' }} className='widget-content'>
      <div className='mx-20 py-10 d-flex justify-between text-center'>
        <div className='d-flex gap-3 align-items-center justify-between'>
          <h4>{label}</h4>
          <Link href='/dashboard/subscriptions'>View All</Link>
        </div>
        <div className='date-picker'>
          <DatePicker
            selected={startDate}
            onChange={handleDateRangeChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            placeholderText={t('date')}
            isClearable={true}
            className='border rounded px-20'
            locale={locale}
          />
        </div>
      </div>
      <Pie options={options} data={chartData} />
    </div>
  )
}

export default ChartMain
