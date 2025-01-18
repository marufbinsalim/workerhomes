'use client'

import PackageSelector from '@/components/common/PackageSelector'
import SubscriptionPlans from '@/components/common/subscription'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

const PricingPage = () => {
  const t = useTranslations('pricing')
  const router = useRouter()
  const locale = useParams().locale

  const { data: session } = useSession()

  return (
    <>
      <div className='header-margin'></div>
      {/* header top margin */}
      <section className='layout-pt-md layout-pb-lg'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-auto'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>{t('title')}</h2>
                <p className=' sectionTitle__text mt-5 sm:mt-0'>
                  {t('description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=' layout-pb-lg'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <PackageSelector
              onChange={plan => {
                if (!session) {
                  router.push(`/${locale}/login`)
                  return
                }

                router.push(
                  `/${locale}/dashboard/dwellings/form?step=1&plan=${plan.id}`
                )
              }}
              value={null}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default PricingPage
