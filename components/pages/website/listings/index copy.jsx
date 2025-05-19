'use client'

import MapComponent from '@/components/common/MapComponent'
import DropdownSelectBar from '@/components/hotel-list/common/DropdownSelectBar'
import HotelProperties from '@/components/hotel-list/hotel-list-v3/HotelProperties'
import TopHeaderFilter from '@/components/hotel-list/hotel-list-v3/TopHeaderFilter'
import { google_key } from '@/config'
import { updateFilter } from '@/lib/services/dwelling'
import { exactPath } from '@/utils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const ListingPage = ({ locale }) => {
  const [foundedLocation, setFoundedLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const p = useSearchParams()
  const [filteredLocations, setFilteredLocations] = useState()
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
      address: `${d?.location?.[0]?.street_one} ${
        d?.location?.[0]?.street_one
      }, ${d?.location?.[0]?.zip_code || ''}, ${
        d?.location?.[0]?.city || ''
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
      <div className='header-margin'></div>
      <section className='halfMap'>
        <div className='halfMap__content'>
          <div className='row x-gap-10 y-gap-10 '>
            <DropdownSelectBar
              setMinStayValue={v =>
                setFilter(prev => ({
                  ...prev,
                  stay: v,
                  guest: {
                    id: 0,
                    text: 'All',
                    value: 'ALL',
                  },
                  price: {
                    id: 0,
                    text: 'All Prices',
                    value: 'ALL',
                  },
                }))
              }
              minStayValue={filter.stay}
              guestValue={filter.guest}
              setGuestNumber={v =>
                setFilter(prev => ({
                  ...prev,
                  guest: v,
                  price: {
                    id: 0,
                    text: 'All Prices',
                    value: 'ALL',
                  },
                  stay: {
                    id: 0,
                    text: 'All',
                    value: 'ALL',
                  },
                }))
              }
              priceValue={filter.price}
              setPriceValue={v =>
                setFilter(prev => ({
                  ...prev,
                  price: v,
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
                }))
              }
            />
          </div>
          {/* End .row */}

          <div className='row y-gap-10 justify-between items-center pt-20'>
            <TopHeaderFilter
              handAscDesc={() => {
                setSort(prev => ({
                  distance: '',
                  price: prev.price === 'asc' ? 'desc' : 'asc',
                }))
              }}
              handleDistanceAscDesc={() => {
                setSort(prev => ({
                  price: '',
                  distance: prev.distance === 'asc' ? 'desc' : 'asc',
                }))
              }}
              total={distanceSorted?.length || 0}
            />
          </div>
          {/* End .row */}

          <div className='row y-gap-20 pt-20'>
            <HotelProperties
              data={sort.distance ? distanceSorted : priceSorted}
              isLoading={locationLoading}
            />
          </div>
          {/* End .row */}
        </div>
        {/* End .halfMap__content */}
        <div className='halfMap__map'>
          <div className='map'>
            <MapComponent
              defaultCenter={distanceSorted?.[0]}
              setLocations={location => setFoundedLocation(location)}
              locations={locations}
              apiKey={google_key}
              zoom={11}
              locale={locale}
            />
          </div>
        </div>
        {/* End halfMap__map */}
      </section>
      {/* End halfMap content */}
    </>
  )
}

export default ListingPage
