'use client'

import useFetch from '@/hooks/useFetch'
import { useState } from 'react'

const SearchBar = ({ value, onChange }) => {
  const [selectedItem, setSelectedItem] = useState(null)

  const { data, isLoading } = useFetch({
    url: '/api/cities',
    keys: ['cities'],
    query: {
      pagination: {
        limit: -1,
      },
    },
  })

  const locationSearchContent =
    data?.length > 0
      ? data?.map(c => ({
          id: c.id,
          name: c.name,
          address: c.country,
        }))
      : []

  const handleOptionClick = item => {
    onChange(item.name)
    setSelectedItem(item)
  }

  return (
    <>
      <div className='searchMenu-loc pr-30 pl-20 lg:py-20 lg:px-0 js-form-dd js-liverSearch'>
        <div
          data-bs-toggle='dropdown'
          data-bs-auto-close='true'
          data-bs-offset='0,22'
        >
          <h4 className='text-15 fw-500 ls-2 lh-16'>Location</h4>
          <div className='text-15 text-light-1 ls-2 lh-16'>
            <input
              autoComplete='off'
              type='search'
              placeholder='Start searching by city, country, zip code or address ...'
              className='js-search js-dd-focus'
              value={value}
              onChange={e => onChange(e.target.value)}
            />
          </div>
        </div>
        {/* End location Field */}

        <div className='shadow-2 dropdown-menu min-width-400 main-search-height'>
          <div className='bg-white px-20 py-20 sm:px-0 sm:py-15 rounded-4'>
            <h6 className='mb-2'>Popular Cities</h6>
            <ul className='y-gap-5 js-results'>
              {locationSearchContent.map(item => (
                <li
                  className={`-link d-block col-12 text-left rounded-4 px-20 py-15 js-search-option mb-1 ${
                    selectedItem && selectedItem.id === item.id ? 'active' : ''
                  }`}
                  key={item.id}
                  role='button'
                  onClick={() => handleOptionClick(item)}
                >
                  <div className='d-flex'>
                    <div className='icon-location-2 text-light-1 text-20 pt-4' />
                    <div className='ml-10'>
                      <div className='text-15 lh-12 fw-500 js-search-option-target'>
                        {item.name}
                      </div>
                      <div className='text-14 lh-12 text-light-1 mt-5'>
                        {item.address}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchBar
