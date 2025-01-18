import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// Register chart components
// ... (Assume ChartJS components registration is here)

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

// Function to get chart data based on period
const getChartData = (period, data, locale) => {
  if (!data) {
    return {
      labels: ['No data'],
      datasets: [
        {
          label: 'Data',
          data: [0],
          backgroundColor: '#fd6900',
        },
      ],
    }
  }

  moment.locale(locale)

  let labels = []
  let chartData = []

  const today = moment()

  const getWeekLabel = startDate => {
    const endDate = startDate.clone().add(6, 'days')
    return `${startDate.format('MMM D')} - ${endDate.format('MMM D')}`
  }

  switch (period) {
    case 'D':
      for (let i = 6; i >= 0; i--) {
        const date = today.clone().subtract(i, 'days')
        const day = date.format('YYYY-MM-DD')
        labels.push(date.format('ddd'))
        chartData.push(data.daily[day] || 0)
      }
      break

    case 'W':
      const startOfWeek = today.clone().startOf('week')

      for (let i = 3; i >= 0; i--) {
        const weekStart = startOfWeek.clone().subtract(i, 'weeks')
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
      break

    case 'M':
      const months = Array.from({ length: 12 }, (_, i) => {
        const monthDate = today.clone().subtract(i, 'months').startOf('month')
        return monthDate.format('YYYY-MM')
      }).reverse()

      labels = months.map(month => moment(month, 'YYYY-MM').format('MMM YYYY'))

      chartData = months.map(month => data.monthly[month] || 0)
      break

    default:
      labels = ['No data']
      chartData = [0]
  }

  return {
    labels,
    datasets: [
      {
        label: ' ',
        data: chartData,
        backgroundColor: '#fd6900',
      },
    ],
  }
}

// Main Chart Component
const BarChart = ({ period, rawData, dataKey, locale, t, label }) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [filteredData, setFilteredData] = useState(rawData)

  const handleDateRangeChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)

    if (start && end) {
      // Filter raw data based on selected date range
      const filtered = rawData.filter(entry => {
        const date = moment(entry[dataKey])
        return date.isBetween(start, end, 'day', '[]')
      })
      setFilteredData(filtered)
    } else {
      setFilteredData(rawData)
    }
  }

  const transformedData = transformData(filteredData, dataKey)
  const chartData = getChartData(period, transformedData, locale)

  const totalDaily = Object.values(transformedData.daily).reduce(
    (acc, val) => acc + val,
    0
  )
  const totalWeekly = Object.values(transformedData.weekly).reduce(
    (acc, val) => acc + val,
    0
  )
  const totalMonthly = Object.values(transformedData.monthly).reduce(
    (acc, val) => acc + val,
    0
  )

  return (
    <div style={{ width: '100%', height: '500px' }} className='widget-content'>
      <div className='date-picker'></div>

      <div className='mx-20 py-10 d-flex justify-between text-center'>
        <h4>{label}</h4>
        <div className='date-picker'>
          <DatePicker
            selected={startDate}
            onChange={handleDateRangeChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            placeholderText={t('buttons.date')}
            isClearable={true}
            className='border rounded px-20'
            locale={locale}
          />
        </div>
      </div>
      <Bar options={options} data={chartData} />

      {/* <div className='totals'>
        <p>Total: {totalDaily}</p>
      </div> */}
    </div>
  )
}

export default BarChart

// 'use client'

// import React, { useState } from 'react'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js'
// import { Bar } from 'react-chartjs-2'
// import moment from 'moment'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
// import 'moment/locale/de'
// import 'moment/locale/en-gb'
// import 'moment/locale/pl'

// // Register chart components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
//           backgroundColor: '#fd6900',
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
//         backgroundColor: '#fd6900',
//       },
//     ],
//   }
// }

// // Main Chart Component
// const BarChart = ({ period, rawData, dataKey, locale }) => {
//   const [startDate, setStartDate] = useState(null)
//   const [endDate, setEndDate] = useState(null)

//   const transformedData = transformData(rawData, dataKey)
//   const chartData = getChartData(period, transformedData, locale)

//   const handleStartDateChange = date => {
//     setStartDate(date)
//   }

//   const handleEndDateChange = date => {
//     setEndDate(date)
//   }

//   return (
//     <div style={{ width: '100%', height: '500px' }} className='widget-content'>
//       <div className='date-picker'>
//         <DatePicker
//           selected={startDate}
//           onChange={handleStartDateChange}
//           selectsStart
//           startDate={startDate}
//           endDate={endDate}
//           placeholderText='Start Date'
//         />
//         <DatePicker
//           selected={endDate}
//           onChange={handleEndDateChange}
//           selectsEnd
//           startDate={startDate}
//           endDate={endDate}
//           minDate={startDate}
//           placeholderText='End Date'
//         />
//       </div>
//       <Bar options={options} data={chartData} />
//     </div>
//   )
// }

// export default BarChart
