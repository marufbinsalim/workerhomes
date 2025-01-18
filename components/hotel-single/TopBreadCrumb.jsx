import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'

const TopBreadCrumb = ({ data }) => {
  const location = data?.location?.[0]
  const address = `${location?.street_one} ${location?.street_two}, ${location?.zip_code}, ${location?.city}, ${location?.country}`
  const router = useRouter()
  return (
    <section className='py-10 d-flex items-center bg-light-2'>
      <div className='container'>
        <div className='row y-gap-10 items-center justify-between'>
          <div className='col-auto'>
            <div className='row x-gap-10 y-gap-5 items-center text-14 text-light-1'>
              <div
                className='col-auto bg-blue-1 rounded mr-20 pointer'
                onClick={() => {
                  router.back()
                }}
              >
                <Icon
                  icon='ic:baseline-arrow-back'
                  className='text-white '
                  width={20}
                  height={20}
                />
              </div>
              {/* End .col-auto */}
              {/* <div className='col-auto'>&gt;</div> */}
              {/* End .col-auto */}
              <div className='col-auto capitalize'>{data?.slug}</div>
              {/* End .col-auto */}
              <div className='col-auto'>&gt;</div>
              {/* End .col-auto */}
              <div className='col-auto capitalize'>
                <div className='text-dark-1'>
                  {location?.street_one ? address : ''}
                </div>
              </div>
              {/* End .col-auto */}
            </div>
            {/* End .row */}
          </div>
          {/* End .col-auto */}

          {/* End col-auto */}
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}
    </section>
  )
}

export default TopBreadCrumb
