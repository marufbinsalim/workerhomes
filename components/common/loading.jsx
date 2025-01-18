'use client'

import { Icon } from '@iconify/react'

const LoadingMessage = ({ label, message }) => {
  return (
    <div className='loading-container'>
      {/* <Icon
        icon='line-md:loading-loop'
        className='ml-10'
        width={30}
        height={30}
      /> */}
      <h6>{label || 'Loading...'}</h6>
      <p>{message}</p>
    </div>
  )
}

export default LoadingMessage
