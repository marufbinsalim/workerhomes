'use client'

import MapComponent from '@/components/common/MapComponent'
import DropdownSelectBar from '@/components/hotel-list/common/DropdownSelectBar'
import RangeFilterBar from '@/components/hotel-list/common/RangeFilterBar'
import HotelProperties from '@/components/hotel-list/hotel-list-v3/HotelProperties'
import TopHeaderFilter from '@/components/hotel-list/hotel-list-v3/TopHeaderFilter'
import { google_key } from '@/config'
import { updateFilter } from '@/lib/services/dwelling'
import { exactPath } from '@/utils'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { FaFilter } from 'react-icons/fa6'

const ListingPage = ({ locale }) => {
  const [foundedLocation, setFoundedLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const p = useSearchParams()
  const [filteredLocations, setFilteredLocations] = useState()
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const t = useTranslations('listings')

  const [sort, setSort] = useState({
    price: '',
    distance: '',
  })
  const [filter, setFilter] = useState({
    price: {
      id: 0,
      text: 'All Prices',
      value: 'ALL',
    },
    guest: {
      id: 0,
      text: 'All',
      value: 'ALL',
    },
    stay: {
      id: 0,
      text: 'All',
      value: 'ALL',
    },
  })

  const uniqueLocations =
    filteredLocations?.length > 0
      ? filteredLocations?.reduce((acc, current) => {
        // Check if the current object's id is already in the accumulator array
        const isDuplicate = acc.some(item => item.id === current.id)
        if (!isDuplicate) {
          acc.push(current)
        }
        return acc
      }, [])
      : []

  const locations = uniqueLocations?.map(d => {
    const icon = {
      url: exactPath(d?.subscription?.package?.icon?.url),
      size: d?.subscription?.package?.iconSize,
    }

    const visibility = d?.subscription?.package?.roles?.visibility_radius || 0

    return {
      id: d.id,
      lat: d.location?.[0]?.geo?.lat,
      lng: d.location?.[0]?.geo?.lng,
      image: exactPath(
        d?.galleries?.[0]?.image?.url
          ? d.galleries?.[0]?.image?.url
          : '/uploads/demo_cbcb7e3dc1.png'
      ),
      name: d.title,
      address: `${d?.location?.[0]?.street_one} ${d?.location?.[0]?.street_one
        }, ${d?.location?.[0]?.zip_code || ''}, ${d?.location?.[0]?.city || ''
        }, ${d?.location?.[0]?.country || ''}`,
      slug: d?.slug,
      icon,
      coverageArea: visibility,
      tier: d?.subscription?.package?.name,
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocationLoading(true)
        const { data } = await updateFilter({
          locale,
        })
        setFilteredLocations(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLocationLoading(false)
      }
    }
    fetchData()
  }, [])

  const realIdes = foundedLocation?.map(d => d.id)

  const defaultLocation =
    uniqueLocations?.length > 0
      ? uniqueLocations?.filter(location => {
        return realIdes?.includes(location.id)
      })
      : []

  let realData = [...defaultLocation]

  switch (filter.price.value) {
    case 'ALL':
      realData = realData
      break
    case 'LOWER_THAN_500':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.amount < 500
      })
      break
    case 'BETWEEN_500_AND_1000':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.amount >= 500 && d.prices?.[0]?.amount <= 1000
      })
      break
    case 'BETWEEN_1000_AND_2000':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.amount >= 1000 && d.prices?.[0]?.amount <= 2000
      })
      break
    case 'BETWEEN_2000_AND_3000':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.amount >= 2000 && d.prices?.[0]?.amount <= 3000
      })
      break
    case 'GREATER_THAN_3000':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.amount > 3000
      })
      break

    default:
      realData = realData?.filter(d => {
        return d.prices?.[0]?.amount
      })
  }

  switch (filter.guest.value) {
    case 'ALL':
      realData = realData
      break
    case 'LOWER_THAN_5':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.guest < 5
      })
      break
    case 'BETWEEN_5_AND_10':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.guest >= 5 && d.prices?.[0]?.guest <= 10
      })
      break
    case 'BETWEEN_10_AND_15':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.guest >= 10 && d.prices?.[0]?.guest <= 15
      })
      break
    case 'GREATER_THAN_15':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.guest > 15
      })
      break

    default:
      realData = realData?.filter(d => {
        return d.prices?.[0]?.guest
      })
  }

  switch (filter.stay.value) {
    case 'ALL':
      realData = realData
      break
    case 'LOWER_THAN_5':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.min_stay < 5
      })
      break
    case 'BETWEEN_5_AND_10':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.min_stay >= 5 && d.prices?.[0]?.min_stay <= 10
      })
      break
    case 'BETWEEN_10_AND_15':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.min_stay >= 10 && d.prices?.[0]?.min_stay <= 15
      })
      break
    case 'GREATER_THAN_15':
      realData = realData?.filter(d => {
        return d.prices?.[0]?.min_stay > 15
      })
      break
    default:
      realData = realData?.filter(d => {
        return d.prices?.[0]?.min_stay
      })
  }

  realData = realData?.sort((a, b) => {
    return (
      parseInt(a?.subscription?.package?.search_position) -
      parseInt(b?.subscription?.package?.search_position)
    )
  })

  const generatePriceSort = () => {
    let data = [...realData]

    if (sort.price === 'asc') {
      data = data.sort((a, b) => {
        return a.prices?.[0]?.amount - b.prices?.[0]?.amount
      })
    } else {
      data = data.sort((a, b) => {
        return b.prices?.[0]?.amount - a.prices?.[0]?.amount
      })
    }

    return data
  }

  const priceSorted = generatePriceSort()

  const generateDistanceSort = () => {
    let data = [...realData]

    if (sort.distance === 'asc') {
      data = data.sort((a, b) => {
        return (
          parseInt(a?.subscription?.package?.visibility_radius) -
          parseInt(b?.subscription?.package?.visibility_radius)
        )
      })
    } else {
      data = data.sort((a, b) => {
        return (
          parseInt(b?.subscription?.package?.visibility_radius) -
          parseInt(a?.subscription?.package?.visibility_radius)
        )
      })
    }

    return data
  }

  const distanceSorted = generateDistanceSort()

  return (
    <>
      <div className="tw:flex tw:flex-col tw:overflow-auto tw:items-center tw:px-4 tw:md:px-30 tw:gap-5 tw:mt-10 tw:w-full tw:py-10 tw:md:py-20">
        {/* Map Section */}
        <div className="tw:w-full tw:h-[300px] tw:md:h-[400px] tw:bg-gray-200 tw:rounded-[10px] tw:overflow-hidden tw:shadow-md">
          <MapComponent
            defaultCenter={distanceSorted?.[0]}
            setLocations={location => setFoundedLocation(location)}
            locations={locations}
            apiKey={google_key}
            zoom={11}
            locale={locale}
          />
        </div>

        {/* Filters Section */}
        <div className="tw:w-full tw:bg-white">
          <div className="tw:flex tw:flex-row tw:flex-wrap tw:justify-between tw:items-center tw:py-4 tw:gap-2 tw:mb-4">
            {/* Total properties and sort buttons */}
            <TopHeaderFilter
              sort={sort}
              handAscDesc={() => {
                setSort(prev => ({
                  distance: '',
                  price: prev.price === 'asc' ? 'desc' : 'asc',
                }));
              }}
              handleDistanceAscDesc={() => {
                setSort(prev => ({
                  price: '',
                  distance: prev.distance === 'asc' ? 'desc' : 'asc',
                }));
              }}
              total={distanceSorted?.length || 0}
            />

            {/* Filter Button & Dropdown */}
            <div className="tw:relative tw:flex tw:mt-9 tw:md:mt-0">
              <button
                onClick={() => setIsFilterOpen(prev => !prev)}
                className="tw:flex tw:items-center tw:underline tw:gap-1 tw:text-sm tw:font-semibold tw:px-2"
              >
                <span>{t('filter')}</span>
                <FaFilter className="tw:w-3 tw:h-3" />
              </button>

              {isFilterOpen && (
                <div
                  className="
              tw:fixed tw:z-30
              tw:left-1/2 tw:md:left-auto
              tw:-translate-x-1/2 tw:md:translate-x-0
              tw:-translate-y-1/2 tw:md:translate-y-0
              tw:md:right-0
              tw:w-[95vw] tw:md:w-[446px]
              tw:mt-24 tw:md:mt-8
              tw:bg-white tw:rounded-md tw:border tw:border-gray-200
            "
                  style={{ boxShadow: '0px 0px 16px 0px #00000014' }}
                >
                  <RangeFilterBar
                    priceValue={filter.price}
                    setPriceValue={v => setFilter(prev => ({ ...prev, price: v }))}
                    guestValue={filter.guest}
                    setGuestNumber={v => setFilter(prev => ({ ...prev, guest: v }))}
                    minStayValue={filter.stay}
                    setMinStayValue={v => setFilter(prev => ({ ...prev, stay: v }))}
                    onClose={() => setIsFilterOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="tw:w-full tw:flex tw:flex-col tw:gap-5">
          <HotelProperties
            data={sort.distance ? distanceSorted : priceSorted}
            isLoading={locationLoading}
          />
        </div>
      </div>


    </>
  )
}

export default ListingPage
