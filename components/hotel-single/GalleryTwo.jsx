'use client'

import Overview from '@/components/hotel-single/Overview'
import PopularFacilities from '@/components/hotel-single/PopularFacilities'
import PropertyHighlights2 from '@/components/hotel-single/PropertyHighlights2'
import { exactPath } from '@/utils'
import moment from 'moment'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import ModalVideo from 'react-modal-video'
import { Gallery, Item } from 'react-photoswipe-gallery'
import BookmarkButton from '../common/BookmarkButton'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function GalleryTwo({ hotel }) {
  const [isOpen, setOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const locale = useParams().locale
  // const currency = getCurrency(locale)
  const prices = hotel?.prices?.sort((a, b) => a.amount - b.amount) || []
  const t = useTranslations('single-listing')
  const tHeader = useTranslations('header')

  const images = hotel?.galleries?.sort((a, b) => a.order - b.order) || []
  const location = hotel?.location?.[0]
  const address = `${location?.street_one} ${location?.street_two}, ${
    location?.zip_code || ''
  }, ${location?.city || ''}, ${location?.country || ''}`

  const mainImage = images?.find(image => image?.isDefault === 'true')

  return (
    <>
      <ModalVideo
        channel='youtube'
        autoplay
        isOpen={isOpen}
        videoId='oqNZOOWF8qM'
        onClose={() => setOpen(false)}
      />
      {/* /uploads/demo_cbcb7e3dc1.png */}
      <section className='pt-40'>
        <div className='container'>
          <div className='hotelSingleGrid'>
            <div>
              {hotel?.galleries?.length > 0 ? (
                <Gallery>
                  <div className='galleryGrid -type-2'>
                    <div className='galleryGrid__item relative d-flex justify-end'>
                      <Item
                        original={exactPath(images?.[0]?.image?.url)}
                        thumbnail={exactPath(
                          images?.[0]?.image?.formats?.thumbnail?.url
                        )}
                        height={images?.[0]?.image?.height}
                        width={images?.[0]?.image?.width}
                      >
                        {({ ref, open }) =>
                          images?.[0]?.image?.url && (
                            <img
                              src={exactPath(images?.[0]?.image?.url)}
                              ref={ref}
                              onClick={open}
                              alt='image'
                              role='button'
                              className='rounded-4'
                            />
                          )
                        }
                      </Item>
                      <div className='absolute px-20 py-20'>
                        <BookmarkButton item={hotel} />
                      </div>
                    </div>
                    {/* End .galleryGrid__item */}

                    {hotel?.galleries?.length > 1 &&
                      hotel?.galleries?.slice(1, 4)?.map((image, index) => {
                        if (
                          index ===
                          hotel?.galleries?.slice(1, 4)?.length - 1
                        ) {
                          return (
                            <div className='galleryGrid__item relative d-flex justify-end items-end'>
                              {image?.image?.url && (
                                <img
                                  src={exactPath(image?.image?.url)}
                                  alt='image'
                                  className='rounded-4'
                                />
                              )}
                              <div className='absolute px-10 py-10 col-12 h-full d-flex justify-end items-end'>
                                <Item
                                  original={exactPath(image?.image?.url)}
                                  thumbnail={exactPath(
                                    image?.image?.formats?.thumbnail?.url
                                  )}
                                  height={image?.image?.height}
                                  width={image?.image?.width}
                                >
                                  {({ ref, open }) => (
                                    <div
                                      className='button -blue-1 px-24 py-15 bg-white text-dark-1 js-gallery'
                                      ref={ref}
                                      onClick={open}
                                      role='button'
                                    >
                                      {t('photos')}
                                    </div>
                                  )}
                                </Item>
                              </div>
                            </div>
                          )
                        } else {
                          return (
                            <div className='galleryGrid__item'>
                              <Item
                                original={exactPath(image?.image?.url)}
                                thumbnail={exactPath(
                                  image?.image?.formats?.thumbnail?.url
                                )}
                                height={image?.image?.height}
                                width={image?.image?.width}
                              >
                                {({ ref, open }) =>
                                  image?.image?.url && (
                                    <img
                                      ref={ref}
                                      onClick={open}
                                      src={exactPath(image?.image?.url)}
                                      alt='image'
                                      className='rounded-4'
                                      role='button'
                                    />
                                  )
                                }
                              </Item>
                            </div>
                          )
                        }
                      })}

                    {hotel?.galleries?.length > 4 &&
                      hotel?.galleries?.slice(4)?.map((image, index) => (
                        <div className='galleryGrid__item' key={index}>
                          <Item
                            original={exactPath(image?.image?.url)}
                            thumbnail={exactPath(
                              image?.image?.formats?.thumbnail?.url
                            )}
                            height={image?.image?.height}
                            width={image?.image?.width}
                          >
                            {({ ref, open }) => (
                              <img
                                ref={ref}
                                hidden={true}
                                onClick={open}
                                src={exactPath(image?.image?.url)}
                                alt='image'
                                className='rounded-4'
                                role='button'
                              />
                            )}
                          </Item>
                        </div>
                      ))}
                    {/* End .galleryGrid__item */}
                  </div>
                </Gallery>
              ) : (
                <div className='row x-gap-10 y-gap-10'>
                  <div className='col-md-8'>
                    <div
                      style={{
                        width: '100%',
                        height: '410px',
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={exactPath('/uploads/demo_cbcb7e3dc1.png')}
                        fill
                        style={{ objectFit: 'cover' }}
                        className='border rounded-4'
                      />
                    </div>
                  </div>
                  <div className='col-md-4 d-sm-none d-md-block'>
                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={exactPath('/uploads/demo_cbcb7e3dc1.png')}
                        fill
                        style={{ objectFit: 'cover' }}
                        className='border rounded-4'
                      />
                    </div>

                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        position: 'relative',
                        marginTop: '10px',
                      }}
                    >
                      <Image
                        src={exactPath('/uploads/demo_cbcb7e3dc1.png')}
                        fill
                        style={{ objectFit: 'cover' }}
                        className='border rounded-4'
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className='row justify-between items-end pt-40'>
                <div className='col-auto'>
                  <div className='row x-gap-20  items-center'>
                    <div className='col-auto'>
                      <h1 className='text-30 sm:text-25 fw-600'>
                        {hotel?.title?.slice(0, 30)}
                      </h1>
                    </div>
                    {/* End .col */}
                  </div>
                  {/* End .row */}

                  {hotel?.locations?.length > 0 && (
                    <div className='row x-gap-20 y-gap-20 items-center'>
                      <div className='col-auto'>
                        <div className='d-flex items-center text-15 text-light-1'>
                          <i className='icon-location-2 text-16 mr-5' />
                          {address}
                        </div>
                      </div>
                      <div className='col-auto'>
                        <a
                          href='#location'
                          data-x-click='mapFilter'
                          className='text-blue-1 text-15 underline'
                        >
                          {t('map')}
                        </a>
                      </div>
                    </div>
                  )}
                  {/* End .row */}
                </div>
                {/* End .col */}

                <div className='col-auto'>
                  <div className='text-14 text-md-end'>
                    {t('start-from')}{' '}
                    <span className='text-22 text-dark-1 fw-500'>
                      {prices?.[0]?.amount || 0} zł
                    </span>
                  </div>
                  <div className='d-flex  justify-content-center align-items-center'>
                    <div className='text-14 text-light-1'>
                      {hotel?.category?.title}
                    </div>
                    <div className='size-3 bg-light-1 rounded-full ml-10 mr-10' />
                    <div className='text-14 text-light-1 '>
                      {moment(hotel?.createdAt).fromNow()}{' '}
                    </div>
                  </div>
                </div>
                {/* End .col */}

                <div className='col-12 d-flex justify-end'>
                  {hotel?.localizations?.length > 0 && (
                    <div className='text-15 text-light-1 mt-10 d-flex flex-column gap-2 fw-600'>
                      {tHeader('locales.title2')}{' '}
                      <span className='d-flex justify-end gap-2'>
                        {hotel?.localizations?.map((item, index) => (
                          <Link
                            key={index}
                            href={`/${item?.locale}/listings/${item.slug}`}
                            className='badge'
                          >
                            {tHeader(`locales.${item?.locale}.language`)}
                          </Link>
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* End .row */}

              <div id='overview' className='row y-gap-40 pt-40 '>
                <div className='col-12'>
                  <Overview data={hotel?.description} />
                </div>
                {/* End col-12 */}

                <div className='col-12'>
                  <h3 className='text-22 fw-500 pt-40 border-top-light'>
                    {t('tabs.facilities')}
                  </h3>
                  <div className='row y-gap-10 pt-20'>
                    <PopularFacilities data={hotel?.features} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <PropertyHighlights2 data={hotel?.contact} dwelling={hotel} />
            </div>
            {/* End right content */}
          </div>
        </div>
        {/* End .container */}
      </section>
    </>
  )
}
