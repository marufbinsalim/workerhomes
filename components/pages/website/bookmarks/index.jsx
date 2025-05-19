'use client'

import DwellingCard from '@/components/common/card/dwelling-card'
import { useBookmarks } from '@/context/BookmarkProvider'
import { useTranslations } from 'next-intl'
import HotelProperties from '@/components/hotel-list/hotel-list-v3/HotelProperties'

const BookmarkPage = () => {
  const t = useTranslations('bookmark')
  const { items, totalBookmarks } = useBookmarks()

  return (
    <>
      <div className='tw:mt-[var(--header-height)]' />
      {/* Header top margin */}

      <section className='tw:py-20'>
        <div className='tw:container tw:mx-auto tw:px-4'>
          {/* Header Section */}
          <div className='tw:flex tw:justify-center tw:text-center tw:mb-12'>
            <div className='tw:max-w-2xl'>
              <h2 className='tw:text-3xl tw:font-bold tw:text-[var(--color-font-dark)]'>
                {t('title')}
              </h2>
              <p className='tw:mt-4 tw:text-[var(--color-font-regular)]'>
                {t('description')}
              </p>
            </div>
          </div>

          {/* Content Section */}
          {items?.data?.length > 0 ? (
            <div className='tw:grid tw:gap-6 md:tw:gap-8'>
              <HotelProperties
                data={items.data.map(item => item.dwelling)}
                isLoading={false}
              />
            </div>
          ) : (
            <div className='tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-20 tw:text-center'>
              <h6 className='tw:text-lg tw:font-semibold tw:mb-2'>
                {t('message.empty')}
              </h6>
              <p className='tw:text-[var(--color-font-regular)]'>
                {t('message.empty2')}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default BookmarkPage
