'use client'

import useFetch from '@/hooks/useFetch'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import Link from './Link'

const CustomerNotification = ({ user, locale }) => {
  const pathname = usePathname()
  const t = useTranslations('warning')

  if (user?.address && user?.phone) {
    return null
  }

  return (
    <div className='w-100 warning-container'>
      <div className='d-flex justify-content-between align-items-center gap-3'>
        <Icon icon='fluent-color:warning-48' />
        <div className='py-30'>
          <h4>{t('title')}</h4>
          <p className='warning-text'>{t('description')}</p>
        </div>
      </div>
      <Link
        href='/dashboard/me'
        className='button btn -sm bg-danger text-white'
      >
        {t('button')}
      </Link>
    </div>
  )
}

export default CustomerNotification
