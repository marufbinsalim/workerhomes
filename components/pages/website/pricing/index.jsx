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

      <section className="tw:w-full font-primary tw:max-w-[1440px]  tw:md:h-[189px] tw:gap-1 tw:px-4 tw:sm:px-8 tw:md:px-20 tw:mt-22 tw:md:mt-0 tw:md:py-30 tw:mx-auto">
        <div className="tw:flex tw:flex-col tw:items-center tw:text-center">
          <h2 className="tw:text-[32px] tw:sm:text-[40px] tw:md:text-[48px] tw:font-semibold tw:text-[var(--color-font-dark)]">
            {t('title')}
          </h2>
          <p className="tw:text-[14px] tw:sm:text-[16px] tw:text-[var(--color-font-regular)] tw:max-w-[90%] tw:sm:max-w-[500px]">
            {t('description')}
          </p>
        </div>
      </section>

      <section className="tw:max-w-[1440px] tw:w-full tw:md:min-h-[751px] tw:mx-auto tw:py-4 tw:md:py-[80px] tw:flex tw:justify-center tw:items-center">
        <div className="tw:w-full tw:px-4 tw:md:px-4">
          <div className="tw:flex tw:flex-col tw:md:flex-row tw:justify-center tw:items-center  tw:gap-4 tw:md:gap-[30px]">
            <PackageSelector
              onChange={plan => {
                if (!session) {
                  router.push(`/${locale}/login`);
                  return;
                }
                router.push(
                  `/${locale}/dashboard/dwellings/form?step=1&plan=${plan.id}`
                );
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
