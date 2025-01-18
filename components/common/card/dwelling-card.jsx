'use client'
import React from 'react'
import Link from '../Link'
import Slider from 'react-slick'
import Image from 'next/image'
import { exactPath, getFromNowInLocale } from '@/utils'
import moment from 'moment'
import { useBookmarks } from '@/context/BookmarkProvider'
import BookmarkButton from '../BookmarkButton'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import { api } from '@/config'

const DwellingCard = ({ item }) => {
  const locale = useParams().locale
  const t = useTranslations('dwelling-card')
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks()
  var itemSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  // custom navigation
  function ArrowSlick(props) {
    let className =
      props.type === 'next'
        ? 'slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-next'
        : 'slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-prev'
    className += ' arrow'
    const char =
      props.type === 'next' ? (
        <a href='#'>
          <span className='icon icon-chevron-right text-12'></span>
        </a>
      ) : (
        <a href='#'>
          <span className='icon icon-chevron-left text-12'></span>
        </a>
      )
    return (
      <button className={className} onClick={props.onClick}>
        {char}
      </button>
    )
  }

  const handleRedirect = async () => {
    try {
      await axios.put(`${api}/api/dwellings/${item.id}/viewed`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='hotelsCard -type-1 hover-inside-slider'>
      <div className='hotelsCard__image'>
        <div className='cardImage inside-slider'>
          <Link href={`/listings/${item.slug}`} onClick={handleRedirect}>
            <Slider
              {...itemSettings}
              arrows={true}
              nextArrow={<ArrowSlick type='next' />}
              prevArrow={<ArrowSlick type='prev' />}
            >
              {item?.galleries?.length > 0 ? (
                item?.galleries
                  ?.sort((a, b) => a?.order - b?.order)
                  ?.map((slide, i) => (
                    <div className='cardImage ratio ratio-1:1' key={i}>
                      <div className='cardImage__content '>
                        <Image
                          width={300}
                          height={300}
                          className='rounded-4 col-12 js-lazy'
                          src={exactPath(slide?.image?.url)}
                          alt='image'
                        />
                      </div>
                    </div>
                  ))
              ) : (
                <div className='cardImage ratio ratio-1:1'>
                  <div className='cardImage__content '>
                    <Image
                      width={300}
                      height={300}
                      className='rounded-4 col-12 js-lazy'
                      src={exactPath('/uploads/demo_cbcb7e3dc1.png')}
                      alt='image'
                    />
                  </div>
                </div>
              )}
            </Slider>
          </Link>
          <div className='cardImage__wishlist'>
            <BookmarkButton item={item} />
          </div>

          <div className='cardImage__leftBadge'>
            <div
              className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${
                item?.isRecommended
                  ? 'bg-dark-1 text-white'
                  : item.subscription?.package?.roles?.featured
                  ? 'bg-blue-1 text-white'
                  : ''
              }`}
            >
              {item?.isRecommended
                ? 'Recommended'
                : item.subscription?.package?.roles?.featured
                ? 'Featured'
                : ''}
            </div>
          </div>
        </div>
      </div>
      <Link onClick={handleRedirect} href={`/listings/${item.slug}`}>
        <div className='hotelsCard__content mt-10'>
          <div className='d-flex items-center lh-14 mb-5'>
            <div className='text-14 text-light-1'>
              {getFromNowInLocale(locale, item?.createdAt)}
            </div>
            <div className='size-3 bg-light-1 rounded-full ml-10 mr-10' />
            <div className='text-14 text-light-1 text-truncate'>
              {item?.category?.title}
            </div>
          </div>

          <h4 className='hotelsCard__title text-dark-1 text-18 lh-16 fw-500 text-truncate'>
            <span>{item?.title}</span>
          </h4>
          <p className='text-light-1 lh-14 text-14 mt-5 text-truncate'>
            {item?.location?.[0]?.street_one ||
              '' + ', ' + item?.location?.[0]?.street_two ||
              '' + ', ' + item?.location?.[0]?.zip_code ||
              '' + ', ' + item?.location?.[0]?.city?.name ||
              ''}
          </p>
          <div className='d-flex items-center mt-20 gap-1'>
            {item?.features?.length > 0 &&
              item?.features?.slice(0, 3)?.map(fet => {
                return (
                  <div
                    key={fet.id}
                    className='flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white'
                  >
                    {fet?.icon?.url ? (
                      <Image
                        src={exactPath(fet?.icon?.url)}
                        alt={fet?.title}
                        width={20}
                        height={20}
                      />
                    ) : (
                      fet?.title || ''
                    )}
                  </div>
                )
              })}
            {/* <div className='text-14 text-dark-1 fw-500 ml-10'>
            {item?.category?.title}
          </div> */}
            <div className='text-14 text-light-1 ml-10 text-truncate'>
              +{item?.features?.length > 3 ? item?.features?.length - 3 : null}{' '}
              {t('more')}
            </div>
          </div>
          <div className='mt-5'>
            <div className='fw-500 '>
              {t('starting-from')}{' '}
              <span className='text-blue-1 text-truncate'>
                {item?.prices?.[0]?.amount} zł
              </span>
              <span className='lowercase text-truncate'>
                {' / '}
                {t('per-night')}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default DwellingCard
