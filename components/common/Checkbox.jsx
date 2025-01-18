import React, { useState } from 'react'

const Checkbox = ({
  label,
  value = false,
  error,
  onChange,
  yesLabel = 'Yes',
  noLabel = 'No',
}) => {
  return (
    <div className={`checkbox-container ${error ? 'has-error' : ''}`}>
      <span className='lh-1 text-16 text-light-1'>{label}</span>
      <div className='checkbox-item-container'>
        <div
          className={`checkbox-item ${value === true ? 'checkbox-active' : ''}`}
          onClick={() => onChange(true)}
        >
          {yesLabel}
        </div>
        <div
          className={`checkbox-item ${
            value === false ? 'checkbox-active' : ''
          }`}
          onClick={() => onChange(false)}
        >
          {noLabel}
        </div>
      </div>

      {error && <div className='checkbox-error'>{error}</div>}
    </div>
  )
}

export default Checkbox
