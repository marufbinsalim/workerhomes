import DateSearch from '../common/DateSearch'
import GuestSearch from './GuestSearch'
import LocationSearch from './LocationSearch'

const MainFilterSearchBox = ({ onChange, value }) => {
  return (
    <>
      <div className='mainSearch bg-white pr-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 bg-light-2 rounded-4'>
        <div className=' items-center'>
          <LocationSearch onChange={onChange} value={value} />
          {/* End Location */}

          {/* <GuestSearch /> */}
          {/* End guest */}

          {/* <div className='button-item'>
            <button className='mainSearch__submit button -dark-1 size-60 lg:w-1/1 col-12 rounded-4 bg-blue-1 text-white'>
              <i className='icon-search text-20' />
            </button>
          </div> */}
          {/* End search button_item */}
        </div>
      </div>
    </>
  )
}

export default MainFilterSearchBox
