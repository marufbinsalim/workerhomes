import DashboardCard from './components/DashboardCard'
import Sidebar from '../common/Sidebar'
import Header from '../../../../components/header/dashboard-header'
import ChartSelect from './components/ChartSelect'
import ChartMain from './components/ChartMain'
import Link from 'next/link'
import RercentBooking from './components/RercentBooking'
import Footer from '../common/Footer'

const index = () => {
  return (
    <>
      <DashboardCard />

      <div className='row y-gap-30 pt-20 chart_responsive'>
        <div className='col-xl-7 col-md-6'>
          <div className='py-30 px-30 rounded-4 bg-white shadow-3'>
            <div className='d-flex justify-between items-center'>
              <h2 className='text-18 lh-1 fw-500'>Earning Statistics</h2>
              <ChartSelect />
            </div>
            {/* End .d-flex */}

            <div className='pt-30'>
              <ChartMain />
            </div>
          </div>
        </div>
        {/* End .col */}

        <div className='col-xl-5 col-md-6'>
          <div className='py-30 px-30 rounded-4 bg-white shadow-3'>
            <div className='d-flex justify-between items-center'>
              <h2 className='text-18 lh-1 fw-500'>Recent Bookings</h2>
              <div>
                <Link href='#' className='text-14 text-blue-1 fw-500 underline'>
                  View All
                </Link>
              </div>
            </div>
            {/* End d-flex */}

            <RercentBooking />
          </div>
          {/* End py-30 */}
        </div>
        {/* End .col */}
      </div>
      {/* End .row */}
    </>
  )
}

export default index
