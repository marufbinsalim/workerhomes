'use client'

import SubscriptionPlans from '@/components/common/subscription'
import useFetch from '@/hooks/useFetch'
import { exactPath } from '@/utils'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import React from 'react'

const GuidePage = () => {
  const t = useTranslations('guide')

  const { data, isLoading } = useFetch({
    keys: ['guides'],
    url: '/api/guidlines',
    query: {
      populate: ['pdf'],
      sort: ['createdAt:asc'],
    },
  })

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
          <div className='row justify-start text-center x-gap-10 y-gap-10'>
            {data?.length > 0 && !isLoading ? (
              data?.map((item, idx) => (
                <div key={idx} className='card col-sm-12 col-md-3 '>
                  <div className='mt-30 mb-30'>
                    <Icon
                      icon='vscode-icons:file-type-pdf2'
                      width={50}
                      height={50}
                    />
                  </div>
                  <h5 className='card-title'>{item?.title}</h5>
                  <p className='card-description'>{item?.description}</p>

                  <div className='px-10 py-10'>
                    {item?.pdf?.url && (
                      <a
                        href={exactPath(item?.pdf?.url)}
                        target='__bland'
                        className='button px-10 py-10 -dark-1 bg-blue-1 text-white col-auto'
                      >
                        Download
                        <Icon icon='radix-icons:download' className='ml-10' />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : data?.length <= 0 && isLoading ? (
              <h5 className='col-12 text-center'>Loading...</h5>
            ) : (
              <h5 className='col-12 text-center'>No items found.</h5>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default GuidePage
