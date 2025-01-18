import DropdownSelect from '@/components/common/DropdownSelect'
import Input from '@/components/common/Input'
import Link from '@/components/common/Link'
import useFetch from '@/hooks/useFetch'
import { Icon } from '@iconify/react'
import { useState } from 'react'

const DashboardCard = ({
  totalSales = 0,
  totalUser = 0,
  totalListing = 0,
  totalLogin = 0,
  isLoading,
  t,
}) => {
  const data = [
    {
      title: t('card.sales'),
      total: totalSales,
      icon: '/img/dashboard/icons/2.svg',
      link: '/dashboard/subscriptions',
      key: 'subscriptions',
      isLoading: isLoading,
    },
    {
      title: t('card.listing'),
      total: totalListing,
      icon: 'flat-color-icons:home',
      link: '/dashboard/dwellings',

      key: 'dwellings',
      isLoading: isLoading,
    },
    {
      title: t('card.customer'),
      total: totalUser,
      link: '/dashboard/users',
      icon: '/img/dashboard/icons/3.svg',
      key: 'customers',
      isLoading: isLoading,
    },
    {
      title: t('card.session'),
      total: '22,786',
      description: 'Total bookable services',
      link: '/dashboard/users',
      icon: '/img/dashboard/icons/4.svg',
      key: 'services',
      isLoading: isLoading,
      total: totalLogin,
    },
  ]

  return (
    <div className='row y-gap-30'>
      {data.map((item, index) => (
        <div key={index} className='col-xl-3 col-md-6 '>
          <div className='px-10 py-10 rounded-4  shadow-3 border'>
            <div className='row y-gap-20 justify-between items-center'>
              <div className='col-12 '>
                <h6>{item.title}</h6>
                <div className=' fw-500 lh-14 d-flex justify-content-between align-items-end w-100'>
                  <h5 className='lh-16  mt-5'>
                    {item?.isLoading ? (
                      <Icon icon='line-md:loading-loop' />
                    ) : (
                      item?.total
                    )}
                  </h5>
                  <Link href={item?.link}>{t('buttons.view')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardCard
