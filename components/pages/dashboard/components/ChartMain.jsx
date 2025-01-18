'use client'

import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import moment from 'moment'
import 'moment/locale/de' // German locale
import 'moment/locale/en-gb' // English locale (UK)
import 'moment/locale/pl' // Polish locale
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Chart options
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
}

// Function to transform raw data into required format
const transformData = (rawData, dataKey) => {
  if (!rawData || !Array.isArray(rawData)) {
    return { daily: {}, weekly: {}, monthly: {} }
  }

  const daily = {}
  const weekly = {}
  const monthly = {}

  rawData.forEach(entry => {
    const date = moment(entry[dataKey])
    const dayKey = date.format('YYYY-MM-DD')
    const weekKey = `${date.format('YYYY')}-${date.week()}`
    const monthKey = date.format('YYYY-MM')

    // Process daily data
    daily[dayKey] = (daily[dayKey] || 0) + 1

    // Process weekly data
    weekly[weekKey] = (weekly[weekKey] || 0) + 1

    // Process monthly data
    monthly[monthKey] = (monthly[monthKey] || 0) + 1
  })

  return { daily, weekly, monthly }
}

// Function to get chart data based on period and date range
const getChartData = (period, data, locale, startDate, endDate) => {
  if (!data) {
    return {
      labels: ['No data'],
      datasets: [
        {
          label: 'Data',
          data: [0],
          backgroundColor: '#1967d2',
        },
      ],
    }
  }

  moment.locale(locale) // Set locale for moment.js

  let labels = []
  let chartData = []

  const today = moment()

  // Helper function to format week label
  const getWeekLabel = startDate => {
    const endDate = startDate.clone().add(6, 'days') // End of the week
    return `${startDate.format('MMM D')} - ${endDate.format('MMM D')}`
  }

  const filterByDateRange = date => {
    return (
      (!startDate || date.isSameOrAfter(startDate, 'day')) &&
      (!endDate || date.isSameOrBefore(endDate, 'day'))
    )
  }

  switch (period) {
    case 'D': // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = today.clone().subtract(i, 'days')
        const day = date.format('YYYY-MM-DD')
        if (filterByDateRange(date)) {
          labels.push(date.format('ddd')) // Short day name
          chartData.push(data.daily[day] || 0)
        }
      }
      break

    case 'W': // Last 4 weeks
      const startOfWeek = today.clone().startOf('week')

      for (let i = 3; i >= 0; i--) {
        const weekStart = startOfWeek.clone().subtract(i, 'weeks')
        if (filterByDateRange(weekStart)) {
          labels.push(getWeekLabel(weekStart))
          const weekEnd = weekStart.clone().add(7, 'days')
          const weekData = Object.entries(data.weekly)
            .filter(([dateKey]) => {
              const entryDate = moment(dateKey, 'YYYY-W')
              return entryDate.isBetween(weekStart, weekEnd, 'day', '[]')
            })
            .reduce((acc, [_, value]) => acc + value, 0)
          chartData.push(weekData)
        }
      }
      break

    case 'M': // Last 12 months
      const months = Array.from({ length: 12 }, (_, i) => {
        const monthDate = today.clone().subtract(i, 'months').startOf('month')
        return monthDate.format('YYYY-MM')
      }).reverse()

      months.forEach(month => {
        const monthDate = moment(month, 'YYYY-MM')
        if (filterByDateRange(monthDate)) {
          labels.push(monthDate.format('MMM YYYY'))
          chartData.push(data.monthly[month] || 0)
        }
      })
      break

    default:
      labels = ['No data']
      chartData = [0]
  }

  return {
    labels,
    datasets: [
      {
        label: 'Data',
        data: chartData,
        backgroundColor: '#fd6900',
      },
    ],
  }
}

// Main Chart Component
const ChartMain = ({ period, rawData, dataKey, locale }) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const transformedData = transformData(rawData, dataKey)
  const chartData = getChartData(
    period,
    transformedData,
    locale,
    startDate,
    endDate
  )

  return (
    <div>
      <div className='date-picker-container'>
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText='Start Date'
          locale={locale}
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText='End Date'
          locale={locale}
        />
      </div>
      <div
        style={{ width: '100%', height: '400px' }}
        className='widget-content'
      >
        <Bar options={options} data={chartData} />
      </div>
    </div>
  )
}

export default ChartMain

// 'use client'

// import React from 'react'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js'
// import { Line } from 'react-chartjs-2'
// import moment from 'moment'
// import 'moment/locale/de' // German locale
// import 'moment/locale/en-gb' // English locale (UK)
// import 'moment/locale/pl' // Polish locale

// // Register chart components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// )

// // Chart options
// const options = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       display: false,
//     },
//     title: {
//       display: false,
//     },
//     tooltips: {
//       position: 'nearest',
//       mode: 'index',
//       intersect: false,
//       yPadding: 10,
//       xPadding: 10,
//       caretSize: 4,
//       backgroundColor: '#1967d2',
//       borderColor: 'rgba(0,0,0,1)',
//       borderWidth: 4,
//     },
//   },
//   scales: {
//     x: {
//       ticks: {
//         autoSkip: true,
//       },
//     },
//     y: {
//       beginAtZero: true,
//     },
//   },
// }

// // Function to transform raw data into required format
// const transformData = (rawData, dataKey) => {
//   if (!rawData || !Array.isArray(rawData)) {
//     return { daily: {}, weekly: {}, monthly: {} }
//   }

//   const daily = {}
//   const weekly = {}
//   const monthly = {}

//   rawData.forEach(entry => {
//     const date = moment(entry[dataKey])
//     const dayKey = date.format('YYYY-MM-DD')
//     const weekKey = `${date.format('YYYY')}-${date.week()}`
//     const monthKey = date.format('YYYY-MM')

//     // Process daily data
//     daily[dayKey] = (daily[dayKey] || 0) + 1

//     // Process weekly data
//     weekly[weekKey] = (weekly[weekKey] || 0) + 1

//     // Process monthly data
//     monthly[monthKey] = (monthly[monthKey] || 0) + 1
//   })

//   return { daily, weekly, monthly }
// }

// // Function to get chart data based on period
// const getChartData = (period, data, locale) => {
//   if (!data) {
//     return {
//       labels: ['No data'],
//       datasets: [
//         {
//           label: 'Data',
//           data: [0],
//           borderColor: '#1967d2',
//           backgroundColor: '#1967d2',
//           fill: false,
//         },
//       ],
//     }
//   }

//   moment.locale(locale) // Set locale for moment.js

//   let labels = []
//   let chartData = []

//   const today = moment()

//   // Helper function to format week label
//   const getWeekLabel = startDate => {
//     const endDate = startDate.clone().add(6, 'days') // End of the week
//     return `${startDate.format('MMM D')} - ${endDate.format('MMM D')}`
//   }

//   switch (period) {
//     case 'D': // Last 7 days
//       for (let i = 6; i >= 0; i--) {
//         const date = today.clone().subtract(i, 'days')
//         const day = date.format('YYYY-MM-DD')
//         labels.push(date.format('ddd')) // Short day name
//         chartData.push(data.daily[day] || 0)
//       }
//       break

//     case 'W': // Last 4 weeks
//       const startOfWeek = today.clone().startOf('week')

//       for (let i = 3; i >= 0; i--) {
//         const weekStart = startOfWeek.clone().subtract(i, 'weeks')
//         labels.push(getWeekLabel(weekStart))
//         const weekEnd = weekStart.clone().add(7, 'days')
//         const weekData = Object.entries(data.weekly)
//           .filter(([dateKey]) => {
//             const entryDate = moment(dateKey, 'YYYY-W')
//             return entryDate.isBetween(weekStart, weekEnd, 'day', '[]')
//           })
//           .reduce((acc, [_, value]) => acc + value, 0)
//         chartData.push(weekData)
//       }
//       break

//     case 'M': // Last 12 months
//       const months = Array.from({ length: 12 }, (_, i) => {
//         const monthDate = today.clone().subtract(i, 'months').startOf('month')
//         return monthDate.format('YYYY-MM')
//       }).reverse()

//       labels = months.map(month => {
//         return moment(month, 'YYYY-MM').format('MMM YYYY')
//       })

//       chartData = months.map(month => data.monthly[month] || 0)
//       break

//     default:
//       labels = ['No data']
//       chartData = [0]
//   }

//   return {
//     labels,
//     datasets: [
//       {
//         label: 'Data',
//         data: chartData,
//         borderColor: '#1967d2',
//         backgroundColor: '#1967d2',
//         fill: false,
//       },
//     ],
//   }
// }

// // Main Chart Component
// const ChartMain = ({ period, rawData, dataKey, locale }) => {
//   const transformedData = transformData(rawData, dataKey)
//   const chartData = getChartData(period, transformedData, locale)

//   return (
//     <div style={{ width: '100%', height: '400px' }} className='widget-content'>
//       <Line options={options} data={chartData} />
//     </div>
//   )
// }

// export default ChartMain
