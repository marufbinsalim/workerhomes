'use client'

import ControlPanel from '@/components/common/controlPanel'
import Link from '@/components/common/Link'
import ChartMain from './components/ChartMain'
import ChartSelect from './components/ChartSelect'
import DashboardCard from './components/DashboardCard'
import RecentBooking from './components/RecentBooking'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import useFetch from '@/hooks/useFetch'
import ListFilter from '@/components/common/ListFilter'
import moment from 'moment'
import { useParams } from 'next/navigation'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'

export default function DashboardPage() {
  const locale = useParams().locale
  const t = useTranslations('dashboard')

  const options = [
    {
      label: t('filters.daily'),
      value: 'D',
    },
    {
      label: t('filters.weekly'),
      value: 'W',
    },
    {
      label: t('filters.monthly'),
      value: 'M',
    },
  ]

  const options2 = [
    {
      value: t('tabs.Sales'),
      key: 'S',
    },
    {
      value: t('tabs.Listings'),
      key: 'L',
    },
    {
      value: t('tabs.Users'),
      key: 'U',
    },
  ]

  const [selected, setSelected] = useState(options[0])
  const [selected2, setSelected2] = useState(options2?.[0])
  const [filter, setFilter] = useState(null)
  const [salesFilter, setSalesFilter] = useState(null)

  const generateUserFilter = () => {
    const today = new Date()

    switch (selected.value) {
      case 'D':
        setFilter({
          filters: {
            date: {
              $gte: new Date(today.setHours(0, 0, 0, 0)),
              $lte: new Date(today.setHours(23, 59, 59, 999)),
            },
          },
        })
        break
      case 'W':
        setFilter({
          filters: {
            date: {
              $gte: new Date(today.setDate(today.getDate() - 7)),
              $lte: new Date(),
            },
          },
        })
        break
      case 'M':
        setFilter({
          filters: {
            date: {
              $gte: new Date(today.setDate(today.getDate() - 30)),
              $lte: new Date(),
            },
          },
        })
        break
      case 'Y':
        setFilter({
          filters: {
            date: {
              $gte: new Date(today.setFullYear(today.getFullYear() - 1)),
              $lte: new Date(),
            },
          },
        })
        break
      default:
        break
    }
  }

  const generateSalesFilter = () => {
    const today = new Date()

    switch (selected.value) {
      case 'D':
        setSalesFilter({
          filters: {
            isFree: {
              $ne: true,
            },
            start_date: {
              $gte: new Date(today.setHours(0, 0, 0, 0)),
              $lte: new Date(today.setHours(23, 59, 59, 999)),
            },
          },
        })
        break
      case 'W':
        setSalesFilter({
          filters: {
            isFree: {
              $ne: true,
            },
            start_date: {
              $gte: new Date(today.setDate(today.getDate() - 7)),
              $lte: new Date(),
            },
          },
        })
        break
      case 'M':
        setSalesFilter({
          filters: {
            isFree: {
              $ne: true,
            },
            start_date: {
              $gte: new Date(today.setDate(today.getDate() - 30)),
              $lte: new Date(),
            },
          },
        })
        break
      case 'Y':
        setSalesFilter({
          filters: {
            isFree: {
              $ne: true,
            },
            start_date: {
              $gte: new Date(today.setFullYear(today.getFullYear() - 1)),
              $lte: new Date(),
            },
          },
        })
        break
      default:
        break
    }
  }

  const { data, isLoading } = useFetch({
    keys: ['dashboard', locale],
    url: `/api/dwellings/all/${locale}`,
    query: {},
  })

  useEffect(() => {
    if (selected2.key === 'U') {
      generateUserFilter()
    } else if (selected2.key === 'S') {
      generateSalesFilter()
    }
  }, [selected.value])

  let chartData = []

  if (selected2.key === 'U') {
    chartData = data?.sessions
  } else if (selected2.key === 'S') {
    chartData = data?.sales
  } else if (selected2.key === 'L') {
    chartData = data?.listings
  }

  const barChartLabel =
    selected2.key === 'S'
      ? t(`tabs.Sales`)
      : selected2?.key === 'L'
      ? t(`tabs.Listings`)
      : t(`tabs.Users`)

  const totalSessionsLogged7DaysAgo = data?.sessions
    ? data?.sessions?.filter(session => {
        const today = new Date()
        const lastWeek = new Date(today.setDate(today.getDate() - 7))

        return moment(session.date).isAfter(lastWeek)
      })
    : []

  return (
    <>
      <ControlPanel
        title={t('title')}
        description={t('description')}
        // breadcrumbs={['']}
        isSearchable={false}
      />

      <div className='py-30 px-30 rounded-4 bg-white shadow-3'>
        <DashboardCard
          isLoading={isLoading}
          totalListing={data?.listings?.length || 0}
          totalSales={data?.sales?.length || 0}
          totalUser={data?.customers?.length || 0}
          totalLogin={totalSessionsLogged7DaysAgo?.length || 0}
          t={t}
        />

        <div className='row y-gap-30 pt-20 chart_responsive'>
          <div className='col-xl-7 col-md-6'>
            <div className='py-30 px-30 rounded-4 bg-white shadow-3'>
              <div className='d-flex justify-between items-center'>
                <div className='d-flex justify-between items-center gap-4'>
                  <ListFilter
                    items={options2}
                    onSelect={setSelected2}
                    selected={selected2}
                  />

                  <ChartSelect
                    options={options}
                    selectedOption={selected}
                    setSelectedOption={setSelected}
                  />
                </div>
              </div>
              {/* End .d-flex */}

              <div className=''>
                {chartData && !isLoading ? (
                  <BarChart
                    label={barChartLabel}
                    period={selected.value}
                    rawData={chartData}
                    locale={locale}
                    t={t}
                    dataKey={
                      selected2.key === 'U'
                        ? 'date'
                        : selected2.key === 'S'
                        ? 'start_date'
                        : 'createdAt'
                    }
                  />
                ) : (
                  <div>{t('loading.analyzing')}</div>
                )}
              </div>
            </div>
          </div>
          {/* End .col */}

          <div className='col-xl-5 col-md-6'>
            <div className='py-30 px-30 rounded-4 bg-white shadow-3'>
              <div className='pb-30'>
                {data?.sales && !isLoading ? (
                  <PieChart
                    period={selected.value}
                    rawData={data?.sales}
                    locale={locale}
                    dataKey='start_date'
                    label={t('tabs.recent-sales')}
                  />
                ) : (
                  <div>{t('loading.analyzing')}</div>
                )}
              </div>

              <div className='mt-30'>
                <RecentBooking />
              </div>
            </div>
            {/* End py-30 */}
          </div>
          {/* End .col */}
        </div>
        {/* End .row */}
      </div>
    </>
  )
}
