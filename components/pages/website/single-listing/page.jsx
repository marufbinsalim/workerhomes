'use client'

import PricingCard from '@/components/common/card/price-card'
import LocationFinder from '@/components/common/LocationFinder'
import HotelProperties from '@/components/hotel-list/hotel-list-v3/HotelProperties'
import Facilities from '@/components/hotel-single/Facilities'
import GalleryTwo from '@/components/hotel-single/GalleryTwo'
import RatingTag from '@/components/hotel-single/RatingTag'
import StickyHeader2 from '@/components/hotel-single/StickyHeader2'
import TopBreadCrumb from '@/components/hotel-single/TopBreadCrumb'
import useFetch from '@/hooks/useFetch'
import { exactPath } from '@/utils'
import { useTranslations } from 'next-intl'
import 'photoswipe/dist/photoswipe.css'

const PLATINUM = '/uploads/platinum_abbff594d3.png'
const GOLD = '/uploads/gold_d483a49301.png'
const SILVER = '/uploads/silver_387507de92.png'
const FREE = '/uploads/home_e14afd668e.png'

const SingleListing = ({ data, locale }) => {
  const location = data?.location?.[0]
  const t = useTranslations('single-listing')
  const icon = {
    url: data?.subscription?.package?.icon?.url,
    size: data?.subscription?.package?.iconSize,
  }

  const visibility = data?.subscription?.package?.roles?.visibility_radius || 0

  const locations = {
    id: data.id,
    coordinates: {
      lat: location?.geo?.lat,
      lng: location?.geo?.lng,
    },
    address: `${location?.street_one} ${location?.street_two}, ${location?.city}, ${location?.country}, ${location?.zip_code}`,
    image: exactPath(data?.galleries?.[0]?.image?.url),
    title: data.title,
    icon,
    coverageArea: visibility,
  }
  const address = `${location?.street_one} ${location?.street_two}, ${
    location?.zip_code
  }, ${location?.city || ''}, ${location?.country || ''}`

  const { data: listedByOwnerDwellings, isLoading } = useFetch({
    url: `/api/dwellings`,
    keys: ['dwellings', 'listings', data?.owner?.id],
    query: {
      filters: {
        status: {
          $eq: 'AVAILABLE',
        },
        id: {
          $ne: data?.id,
        },
        owner: {
          id: {
            $eq: data?.owner?.id,
          },
        },
      },
      locale,
      populate: [
        'galleries.image',
        'seo',
        'location',
        'contact',
        'features.icon',
        'category',
        'prices',
        'owner',
      ],
      pagination: {
        limit: 5,
      },
      sort: ['createdAt:desc'],
    },
  })

  const { data: featuredDwellings, isLoading: featuredDwellingsLoading } =
    useFetch({
      url: `/api/dwellings`,
      keys: ['dwellings', 'listings', data?.owner?.id],
      query: {
        filters: {
          status: {
            $eq: 'AVAILABLE',
          },
          id: {
            $ne: data?.id,
          },
          subscription: {
            package: {
              isFeatured: {
                $eq: true,
              },
            },
          },
        },
        locale,
        populate: [
          'galleries.image',
          'seo',
          'location',
          'contact',
          'features.icon',
          'category',
          'prices',
          'owner',
        ],
        pagination: {
          limit: 4,
        },
        sort: ['createdAt:desc'],
      },
    })

  return (
    <>
      <div className='header-margin'></div>

      <StickyHeader2 hotel={data} />
      {/* End StickyHeader2 */}

      <TopBreadCrumb data={data} />
      {/* End top breadcrumb */}

      <GalleryTwo hotel={data} />

      {/* End gallery grid wrapper */}

      <section className='pt-30'>
        <div className='container'>
          <div className='row y-gap-30'>
            <div className='col-12'>{data?.isRecommended && <RatingTag />}</div>
            {/* End .col-12 This property is in high demand! */}
          </div>
        </div>
        {/* End container */}
      </section>
      {/* End single page content */}

      {data?.amenities?.length > 0 && (
        <section className='mt-40' id='facilities'>
          <div className='container'>
            <div className='row x-gap-40 y-gap-40'>
              <div className='col-12'>
                <h3 className='text-22 fw-500'>{t('tabs.amenities')}</h3>
                <div className='row x-gap-40 y-gap-40 pt-20'>
                  <Facilities data={data?.amenities} />
                </div>
                {/* End .row */}
              </div>
              {/* End .col-12 */}
            </div>
            {/* End .row */}
          </div>
          {/* End .container */}
        </section>
      )}
      {/* End facilites section */}

      <div className='container mt-40 mb-40'>
        <div className='border-top-light'></div>
      </div>

      {data?.prices?.length > 0 && (
        <section className='layout-pt-md layout-pb-lg'>
          <div className='container'>
            <div className='row justify-center '>
              <div className='col-12 text-center'>
                <div className='sectionTitle -md'>
                  <h2 className='sectionTitle__title'>
                    {t('sections.price.title')}
                  </h2>
                  <p className=' sectionTitle__text mt-5 sm:mt-0'>
                    {t('sections.price.description')}
                  </p>
                </div>
              </div>
              <div className='col-12'>
                <div className='row x-gap-0 y-gap-5 justify-start'>
                  {data?.prices?.length > 0 &&
                    data?.prices?.map((p, idx) => (
                      <div key={idx} className='col-sm-12 col-md-3'>
                        <PricingCard
                          adults={p.adult}
                          amountNote={p.note}
                          guests={p.guest}
                          minStay={p.min_stay}
                          price={p.amount}
                          type={p.total ? `${p.total} X ${p.type}` : p.type}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className='layout-pt-sm layout-pb-lg' id='location'>
        <div className='container'>
          <div className='sectionTitle -md'>
            <h2 className='sectionTitle__title'>
              {t('sections.location.title')}
            </h2>
            <div className='pb-20 d-flex items-center text-15 text-light-1'>
              <i className='icon-location-2 text-16 mr-5' />
              {address}
            </div>
          </div>

          <LocationFinder
            locations={[locations]}
            zoom={20}
            fullHeight={false}
            hasCoverageArea={false}
            showDirections={true}
            locale={locale}
          />

          <div>
            <div className='container mt-20 mb-20'>
              <h5> {t('direction')}</h5>
              <div className='border-top-light'></div>

              <h6 className='mt-20'>
                <i className='icon-location-2 text-16 mr-5' />
                {data?.direction || address}
              </h6>
            </div>
          </div>
        </div>
      </section>

      {listedByOwnerDwellings?.length > 0 && (
        <section className='layout-pt-md layout-pb-lg'>
          <div className='container'>
            <div className='row justify-center '>
              <div className='col-12 text-center'>
                <div className='sectionTitle -md'>
                  <h2 className='sectionTitle__title'>
                    {t('sections.top-properties.title')} {data?.owner?.name}
                  </h2>
                  <p className=' sectionTitle__text mt-5 sm:mt-0'>
                    {t('sections.top-properties.description')}
                  </p>
                </div>
              </div>
              <div className='col-12 mt-30'>
                <HotelProperties
                  data={listedByOwnerDwellings}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {featuredDwellings?.length > 0 && (
        <section className='layout-pt-md layout-pb-lg'>
          <div className='container'>
            <div className='row justify-center '>
              <div className='col-12 text-center'>
                <div className='sectionTitle -md'>
                  <h2 className='sectionTitle__title'>
                    {t('sections.featured.title')}
                  </h2>
                  <p className=' sectionTitle__text mt-5 sm:mt-0'>
                    {t('sections.featured.description')}
                  </p>
                </div>
              </div>

              <div className='col-12 mt-30'>
                <HotelProperties
                  data={featuredDwellings}
                  isLoading={featuredDwellingsLoading}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default SingleListing
