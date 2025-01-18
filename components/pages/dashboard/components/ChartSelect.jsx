'use client'

import { useState } from 'react'

const ChartSelect = ({ options, selectedOption, setSelectedOption }) => {
  return (
    <div className='dropdown js-dropdown js-category-active'>
      <div
        className='dropdown__button d-flex items-center bg-white border-light rounded-100 px-15 py-1 text-14 lh-12'
        data-bs-toggle='dropdown'
        data-bs-auto-close='true'
        aria-expanded='false'
        data-bs-offset='0,10'
      >
        <span className='js-dropdown-title'>{selectedOption.label}</span>
        <i className='icon icon-chevron-sm-down text-7 ml-10' />
      </div>
      <div className='toggle-element -dropdown  dropdown-menu'>
        <div className='text-14 y-gap-15 js-dropdown-list'>
          {options.map((option, index) => (
            <div key={index}>
              <button
                className={`d-block js-dropdown-link ${
                  selectedOption.value === option.value ? 'text-blue-1 ' : ''
                }`}
                onClick={() => {
                  setSelectedOption(option)
                  document.querySelector('.js-dropdown-title').textContent =
                    option.value
                  // TODO: Apply filter based on selected option
                }}
              >
                {option.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChartSelect
