'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { use, useState } from 'react'

const LanguageMegaMenu = ({ textClass }) => {
  const t = useTranslations('header')
  const locale = useParams().locale
  const [click, setClick] = useState(false)
  const handleCurrency = () => setClick(prevState => !prevState)
  const router = useRouter()
  const pathname = usePathname()

  const languageContent = [
    {
      id: 1,
      language: t('locales.en.language'),
      country: t('locales.en.country'),
      locale: 'en',
      icon: '/img/app/england.png',
      image: true,
    },
    {
      id: 2,
      language: t('locales.de.language'),
      country: t('locales.de.country'),
      locale: 'de',
      icon: 'emojione:flag-for-germany',
    },
    {
      id: 3,
      language: t('locales.pl.language'),
      country: t('locales.pl.country'),
      locale: 'pl',
      icon: 'emojione:flag-for-poland',
    },
  ]

  const [selectedCurrency, setSelectedCurrency] = useState(languageContent[0])

  const handleItemClick = item => {
    setSelectedCurrency(item)
    setClick(false)
  }

  const changeLocale = locale => {
    const exactPath = pathname.replace(/^\/[a-z]{2}/, '')
    router.push(`/${locale}${exactPath}`)
  }

  if (pathname?.length > 9 && pathname.includes('/blogs')) {
    return null
  }

  if (pathname?.length >= 13 && pathname.includes('/listings')) {
    return null
  }

  return (
    <>
      {/* Start language currency Selector */}
      <div className='col-auto'>
        <button
          className={`d-flex items-center text-14 ${textClass}`}
          onClick={handleCurrency}
        >
          {languageContent.find(item => item.locale === locale)?.image ? (
            <Image
              src={languageContent.find(item => item.locale === locale)?.icon}
              width={20}
              height={20}
              className='rounded-full mr-10 border'
            />
          ) : (
            <Icon
              icon={languageContent.find(item => item.locale === locale)?.icon}
              width={20}
              height={20}
              className='rounded-full mr-10 border'
            />
          )}
          <span className='js-language-mainTitle'>
            {' '}
            {languageContent.find(item => item.locale === locale)?.language ||
              ''}
          </span>
          <i className='icon-chevron-sm-down text-7 ml-15 ' />
        </button>
      </div>
      {/* End language currency Selector */}

      <div className={`langMenu js-langMenu ${click ? '' : 'is-hidden'}`}>
        <div className='currencyMenu__bg' onClick={handleCurrency}></div>
        <div className='langMenu__content bg-white rounded-4'>
          <div className='d-flex items-center justify-between px-30 py-20 sm:px-15 border-bottom-light'>
            <div className='text-20 fw-500 lh-15'>{t('locales.title')}</div>
            <button className='pointer' onClick={handleCurrency}>
              <i className='icon-close' />
            </button>
          </div>
          {/* Emd flex-wrapper */}
          <ul className='modalGrid px-30 py-30 sm:px-15 sm:py-15'>
            {languageContent.map(item => (
              <li
                className={`modalGrid__item js-item ${
                  item.locale === locale ? 'active' : ''
                }`}
                key={item.id}
                onClick={() => {
                  setSelectedCurrency(item)
                  changeLocale(item.locale)
                }}
              >
                <div className='py-10 px-15 sm:px-5 sm:py-5'>
                  <div className='text-15 lh-15 fw-500 text-dark-1'>
                    {item.language}
                  </div>
                  <div className='text-14 lh-15 mt-5 js-title'>
                    {item.country}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* End langMenu */}
      </div>
    </>
  )
}

export default LanguageMegaMenu
