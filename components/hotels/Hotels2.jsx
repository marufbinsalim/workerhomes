'use client'

import Image from 'next/image'
import Link from '@/components/common/Link'
import Slider from 'react-slick'
import { hotelsData } from '@/data/hotels'
import isTextMatched from '@/utils/isTextMatched'
import { exactPath } from '@/utils'
import moment from 'moment'

const Hotels2 = ({ data }) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: data?.length > 4 ? 4 : data?.length,
    // slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

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

  return (
    <>
      <Slider {...settings}>
        {data?.length > 0 &&
          data?.map(item => (
            <div
              className='col-xl-3 col-lg-3 col-sm-6'
              key={item?.id}
              data-aos='fade'
              data-aos-delay={item.delayAnimation}
            >
              <Link
                href={`/dwellings/${item.slug}`}
                className='hotelsCard -type-1 hover-inside-slider'
              >
                <div className='hotelsCard__image'>
                  <div className='cardImage inside-slider'>
                    <Slider
                      {...itemSettings}
                      arrows={true}
                      nextArrow={<ArrowSlick type='next' />}
                      prevArrow={<ArrowSlick type='prev' />}
                    >
                      {item?.galleries
                        ?.sort((a, b) => b?.order - a?.order)
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
                        ))}
                    </Slider>

                    <div className='cardImage__wishlist'>
                      <button className='button -blue-1 bg-white size-30 rounded-full shadow-2'>
                        <i className='icon-heart text-12' />
                      </button>
                    </div>

                    <div className='cardImage__leftBadge'>
                      <div
                        className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${
                          item?.isTrended ? 'bg-dark-1 text-white' : ''
                        } ${item?.isPopulared ? 'bg-blue-1 text-white' : ''}`}
                      >
                        {item?.isTrended
                          ? 'Trended'
                          : item?.isPopulared
                          ? 'Popular'
                          : ''}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='hotelsCard__content mt-10'>
                  <div className='d-flex items-center lh-14 mb-5'>
                    <div className='text-14 text-light-1'>
                      {moment(item?.createdAt).fromNow()}{' '}
                    </div>
                    <div className='size-3 bg-light-1 rounded-full ml-10 mr-10' />
                    <div className='text-14 text-light-1'>
                      {item?.category?.title}
                    </div>
                  </div>
                  <h4 className='hotelsCard__title text-dark-1 text-18 lh-16 fw-500'>
                    <span>{item?.title}</span>
                  </h4>
                  <p className='text-light-1 lh-14 text-14 mt-5'>
                    {item?.location?.[0]?.street_one ||
                      '' + ', ' + item?.location?.[0]?.street_two ||
                      '' + ', ' + item?.location?.[0]?.zip_code ||
                      '' + ', ' + item?.location?.[0]?.city?.name ||
                      ''}
                  </p>
                  <div className='d-flex items-center mt-20'>
                    <div className='flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white'>
                      {item?.category?.title}
                    </div>
                    <div className='text-14 text-dark-1 fw-500 ml-10'>
                      {item?.category?.title}
                    </div>
                    {/* <div className='text-14 text-light-1 ml-10'>
                      {item?.numberOfReviews} reviews
                    </div> */}
                  </div>
                  <div className='mt-5'>
                    <div className='fw-500'>
                      Starting from{' '}
                      <span className='text-blue-1'>
                        US$ {item?.prices?.[0]?.amount}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </Slider>
    </>
  )
}

export default Hotels2
