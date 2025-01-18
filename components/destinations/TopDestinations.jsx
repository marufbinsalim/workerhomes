'use client'

import Link from '@/components/common/Link'
import { LocationContext } from '@/context/LocationProvider'
import useFetch from '@/hooks/useFetch'
import { exactPath } from '@/utils'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

const TopDestinations = async ({ locale }) => {
  const { updateLocation } = useContext(LocationContext)
  const router = useRouter()
  const { data, isLoading } = useFetch({
    keys: ['popularCities'],
    url: '/api/cities',
    query: {
      populate: ['image', 'country'],
      sort: ['order:asc'],
      pagination: {
        limit: 8,
      },
    },
  })

  const generateCountryName = (locale, country) => {
    if (locale === 'en') {
      return country
    } else if (locale === 'pl' && country === 'United Kingdom') {
      return 'Wielka Brytania'
    } else if (locale === 'pl' && country === 'Poland') {
      return 'Polska'
    } else if (locale === 'pl' && country === 'Germany') {
      return 'Niemcy'
    } else if (locale === 'de' && country === 'United Kingdom') {
      return 'Vereinigtes Königreich'
    } else if (locale === 'de' && country === 'Poland') {
      return 'Polen'
    } else if (locale === 'de' && country === 'Germany') {
      return 'Deutschland'
    }
  }

  const handleSearchWithCity = item => {
    const coordinates = {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lng),
    }

    const formatted_address = `${item.name}, ${item.country}`

    updateLocation(coordinates, formatted_address)

    router.push(`${locale}/listings`)
  }

  return (
    <>
      {data?.length > 0 && !isLoading
        ? data?.map(item => (
            <div
              className='col-xl-3 col-md-4 col-sm-6'
              key={item.id}
              data-aos='fade'
              data-aos-delay={item.delayAnimation}
            >
              <div
                // href={`/listings`}
                className='citiesCard -type-3 d-block h-full rounded-4 pointer city-card-container'
                onClick={e => {
                  e.preventDefault()
                  handleSearchWithCity(item)
                }}
              >
                <div className='citiesCard__image ratio ratio-1:1'>
                  <Image
                    fill
                    objectFit='cover'
                    className='col-12 js-lazy'
                    src={
                      item?.image?.url
                        ? exactPath(item.image?.url)
                        : exactPath('/uploads/demo_cbcb7e3dc1.png')
                    }
                    alt='image'
                  />
                </div>
                <div className='citiesCard__content px-30 py-30'>
                  <h4 className='text-26 fw-600 text-white text-capitalize'>
                    {item.name}
                  </h4>
                  <div className='text-15 text-white'>
                    {generateCountryName(locale, item?.country)}
                  </div>
                </div>
              </div>
            </div>
          ))
        : null}
    </>
  )
}

export default TopDestinations

export const CityCardSkelton = ({ count }) => {
  return Array.from({ length: count }).map((_, index) => (
    <div className=' col-xl-3 col-md-4 col-sm-6' key={index}>
      <div className='city-card-skelton'>
        <Icon icon='line-md:loading-loop' />
      </div>
    </div>
  ))
}
