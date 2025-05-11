'use client'

import useFetch from '@/hooks/useFetch'
import { useTranslations } from 'next-intl'
import React, { Suspense } from 'react'
import TopDestinations, {
  CityCardSkelton,
} from '@/components/destinations/TopDestinations'
import WhyChoose from '@/components/home/home-3/WhyChoose'
import DwellingList from '@/components/common/dwellingList'
import Link from '@/components/common/Link'

const MainPage = ({ locale }) => {
  const t = useTranslations('landing')

  const { data: recommendedDwellings } = useFetch({
    keys: ['dwellings'],
    url: '/api/dwellings',
    query: {
      populate: [
        'galleries.image',
        'category',
        'location.city',
        'prices',
        'features.icon',
        'subscription.package',
      ],
      sort: ['subscription.package.search_position:asc', 'createdAt:desc'],
      locale,
      filters: {
        isRecommended: {
          $eq: true,
        },
        isApproved: {
          $eq: true,
        },
        status: {
          $eq: 'AVAILABLE',
        },
      },
      pagination: {
        limit: 4,
      },
    },
  })

  const { data: featuredDwellings } = useFetch({
    keys: ['dwellings'],
    url: '/api/dwellings',
    query: {
      populate: [
        'galleries.image',
        'category',
        'location.city',
        'prices',
        'features.icon',
        'subscription.package',
      ],
      sort: ['subscription.package.search_position:asc', 'createdAt:desc'],
      locale,
      filters: {
        $and: [
          {
            subscription: {
              package: {
                isFeatured: {
                  $eq: false,
                },
              },
            },
          },
          {
            isApproved: {
              $eq: true,
            },
          },
          {
            status: {
              $eq: 'AVAILABLE',
            },
          },
        ],
      },
      pagination: {
        limit: 4,
      },
    },
  })

  return (
    <>
      <section className='layout-pt-md  layout-pb-md'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-auto'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>{t('city.title')}</h2>
                <p className=' sectionTitle__text mt-5 sm:mt-0'>
                  {t('city.description')}
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className='row y-gap-40 justify-between pt-40 sm:pt-20'>
            <Suspense fallback={<CityCardSkelton />}>
              <TopDestinations locale={locale} />
            </Suspense>
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      <section className='layout-pt-md layout-pb-md'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-auto'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>{t('about.title')}</h2>
                <p className=' sectionTitle__text mt-5 sm:mt-0'>
                  {t('about.description')}
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className='row y-gap-40 justify-between pt-50'>
            <WhyChoose />
          </div>
          {/* End row */}
        </div>
        {/* End .container */}
      </section>

      <section className='layout-pt-md layout-pb-md'>
        <div className='container'>
          <div className='row y-gap-20 justify-between items-end'>
            <div className='col-auto'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>
                  {t('recommended.title')}
                </h2>
                <p className=' sectionTitle__text mt-5 sm:mt-0'>
                  {t('recommended.description')}
                </p>
              </div>
            </div>
            {/* End .col */}

            <div className='col-auto'>
              <Link
                href='/listings'
                className='button -md -blue-1 bg-blue-1-05 text-blue-1'
              >
                {t('recommended.button')}{' '}
                <div className='icon-arrow-top-right ml-15' />
              </Link>
            </div>
          </div>
          {/* End .row */}

          <div className='row y-gap-30 pt-40 sm:pt-20 item_gap-x30'>
            <Suspense fallback={<CityCardSkelton />}>
              <DwellingList data={recommendedDwellings} />
            </Suspense>
          </div>
          {/* End relative */}
        </div>
      </section>

      {featuredDwellings?.length > 0 && (
        <section className='layout-pt-md layout-pb-md'>
          <div className='container'>
            <div className='row y-gap-20 justify-between items-end'>
              <div className='col-auto'>
                <div className='sectionTitle -md'>
                  <h2 className='sectionTitle__title'>{t('featured.title')}</h2>
                  <p className=' sectionTitle__text mt-5 sm:mt-0'>
                    {t('featured.description')}
                  </p>
                </div>
              </div>
              {/* End .col */}

              <div className='col-auto'>
                <Link
                  href='/listings'
                  className='button -md -blue-1 bg-blue-1-05 text-blue-1'
                >
                  {t('featured.button')}{' '}
                  <div className='icon-arrow-top-right ml-15' />
                </Link>
              </div>
              {/* End .col */}
            </div>
            {/* End .row */}

            <div className='y-gap-30 pt-40 sm:pt-20 item_gap-x30'>
              <Suspense fallback={<CityCardSkelton />}>
                <DwellingList data={featuredDwellings} />
              </Suspense>
            </div>
            {/* End .row */}
          </div>
          {/* End .container */}
        </section>
      )}
    </>
  )
}

export default MainPage
