'use client'

import { useEffect, useState } from 'react'
import FilterBox2 from './filter-box-2'
import { getCurrency, getExchange } from '@/lib/services/currency'
import { useParams } from 'next/navigation'
import ContactButton from '../common/ContactButton'
import { useTranslations } from 'next-intl'
const StickyHeader2 = ({ hotel }) => {
  const [header, setHeader] = useState(false)
  // const [amount, setAmount] = useState(0)
  const locale = useParams().locale
  // const currency = getCurrency(locale)
  const t = useTranslations('single-listing')

  const changeBackground = () => {
    if (window.scrollY >= 200) {
      setHeader(true)
    } else {
      setHeader(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', changeBackground)
  }, [])

  // const handleUpdateAmount = async amount => {
  //   const data = await getExchange('PLN', currency, amount)
  //   setAmount(data?.convertedAmount)
  // }

  // useEffect(() => {
  //   handleUpdateAmount(hotel?.prices?.[0]?.amount)
  // }, [locale])

  return (
    <div className={`singleMenu js-singleMenu ${header ? '-is-active' : ''}`}>
      <div className='col-12'>
        {/* <div className='py-10 bg-dark-2'>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <FilterBox2 />
              </div>
            </div>
          </div>
        </div> */}
        {/* End Search filter top */}

        <div className='singleMenu__content'>
          <div className='container'>
            <div className='row y-gap-20 justify-between items-center'>
              <div className='col-auto'>
                <div className='singleMenu__links row x-gap-30 y-gap-10'>
                  <div className='col-auto'>
                    <a href='#overview'>{t('tabs.overview')}</a>
                  </div>
                  <div className='col-auto'>
                    <a href='#facilities'>{t('tabs.facilities')}</a>
                  </div>
                  <div className='col-auto'>
                    <a href='#amenities'>{t('tabs.amenities')}</a>
                  </div>
                  <div className='col-auto'>
                    <a href='#pricing'>{t('tabs.price')}</a>
                  </div>
                  <div className='col-auto'>
                    <a href='#location'>{t('tabs.location')}</a>
                  </div>
                </div>
              </div>
              {/* End .col */}

              <div className='col-auto'>
                <div className='row x-gap-15 y-gap-15 items-center'>
                  <div className='col-auto'>
                    <div className='text-14'>
                      {t('start-from')}{' '}
                      <span className='text-22 text-dark-1 fw-500'>
                        {hotel?.prices?.[0]?.amount + ' '}
                        zł
                      </span>
                    </div>
                  </div>
                  <div className='col-auto'>
                    <ContactButton dwelling={hotel} />
                  </div>
                </div>
              </div>
              {/* End .col */}
            </div>
            {/* End .row */}
          </div>
          {/* End .container */}
        </div>
        {/* End .singleMenu__content */}
      </div>
    </div>
  )
}

export default StickyHeader2
