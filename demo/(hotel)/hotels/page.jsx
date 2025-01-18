import Header11 from '@/components/header/header-11'
import DropdownSelelctBar from '@/components/hotel-list/common/DropdownSelectBar'
import MapPropertyFinder from '@/components/hotel-list/common/MapPropertyFinder'
import Pagination from '@/components/hotel-list/common/Pagination'
import HotelProperties from '@/components/hotel-list/hotel-list-v3/HotelProperties'
import MainFilterSearchBox from '@/components/hotel-list/hotel-list-v3/MainFilterSearchBox'
import TopHeaderFilter from '@/components/hotel-list/hotel-list-v3/TopHeaderFilter'
import Wrapper from '@/components/layout/Wrapper'
import dynamic from 'next/dynamic'

export const metadata = {
  title: 'Hotel List v3 || GoTrip - Travel & Tour React NextJS Template',
  description: 'GoTrip - Travel & Tour React NextJS Template',
}

const HotelsPage = () => {
  return (
    <Wrapper>
      {/* End Page Title */}

      <div className='header-margin'></div>
      {/* header top margin */}

      <section className='halfMap'>
        <div className='halfMap__content'>
          <MainFilterSearchBox />

          <div className='row x-gap-10 y-gap-10 pt-20'>
            <DropdownSelelctBar />
          </div>
          {/* End .row */}

          <div className='row y-gap-10 justify-between items-center pt-20'>
            <TopHeaderFilter />
          </div>
          {/* End .row */}

          <div className='row y-gap-20 pt-20'>
            <HotelProperties />
          </div>
          {/* End .row */}

          <Pagination />
          {/* End Pagination */}
        </div>
        {/* End .halfMap__content */}

        <div className='halfMap__map'>
          <div className='map'>
            <MapPropertyFinder />
          </div>
        </div>
        {/* End halfMap__map */}
      </section>
      {/* End halfMap content */}
    </Wrapper>
  )
}

export default dynamic(() => Promise.resolve(HotelsPage), {
  ssr: false,
})
