'use client'

import PricingCard from '@/components/common/card/price-card'
import LocationFinder from '@/components/common/LocationFinder'
import Facilities from '@/components/hotel-single/Facilities'
import GalleryTwo from '@/components/hotel-single/GalleryTwo'
import RatingTag from '@/components/hotel-single/RatingTag'
import TopBreadCrumb from '@/components/hotel-single/TopBreadCrumb'
import { exactPath } from '@/utils'
import 'photoswipe/dist/photoswipe.css'

const PLATINUM = '/uploads/platinum_abbff594d3.png'
const GOLD = '/uploads/gold_d483a49301.png'
const SILVER = '/uploads/silver_387507de92.png'
const FREE = '/uploads/home_e14afd668e.png'

const PreviewDwelling = ({ data }) => {
  const location = data?.location?.[0]

  const icon =
    data?.subscription?.package?.name === 'Platinum'
      ? { url: PLATINUM, size: [42, 42] }
      : data?.subscription?.package?.name === 'Gold'
      ? { url: GOLD, size: [35, 35] }
      : data?.subscription?.package?.name === 'Silver'
      ? { url: SILVER, size: [28, 28] }
      : { url: FREE, size: [24, 24] }

  const locations = {
    coordinates: {
      lat: location?.geo?.lat,
      lng: location?.geo?.lng,
    },
    image: exactPath(data?.galleries?.[0]?.image?.url),
    title: data?.title,
    icon,
  }
  const address = `${location?.street_one} ${location?.street_two}, ${
    location?.zip_code
  }, ${location?.city || ''}, ${location?.country || ''}`

  return (
    <>
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
                <h3 className='text-22 fw-500'>Most Popular Amenities</h3>
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

      {/* End similar hotel */}
      <section className='layout-pt-md layout-pb-lg'>
        <div className='container'>
          <div className='row justify-center '>
            <div className='col-12 text-center'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>
                  Available Prices & Conditions
                </h2>
                <p className=' sectionTitle__text mt-5 sm:mt-0'>
                  Prices and conditions for this property
                </p>
              </div>
            </div>
            <div className='col-12'>
              <div className='row x-gap-0 y-gap-5 justify-start'>
                {data?.prices?.length > 0 ? (
                  data?.prices?.map((p, idx) => (
                    <div key={idx} className='col-sm-12 col-md-4'>
                      <PricingCard
                        adults={p.adult}
                        amountNote={p.note}
                        guests={p.guest}
                        minStay={p.min_stay}
                        price={p.amount}
                        type={p.type}
                      />
                    </div>
                  ))
                ) : (
                  <div className='col-12 text-center badge mt-40'>
                    No Price has been found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='layout-pt-sm layout-pb-lg' id='location'>
        <div className='container'>
          <div className='sectionTitle -md'>
            <h2 className='sectionTitle__title'>Location & Surroundings</h2>
            {locations?.coordinates?.lat && (
              <div className='d-flex items-center text-15 text-light-1 my-10'>
                <i className='icon-location-2 text-16 mr-5' />
                {address}
              </div>
            )}
          </div>

          {locations?.coordinates?.lat ? (
            <LocationFinder
              locations={[locations]}
              zoom={20}
              fullHeight={false}
              showDirections={false}
            />
          ) : (
            <div className='badge mt-40'>No location has been found.</div>
          )}
        </div>
      </section>
    </>
  )
}

export default PreviewDwelling
