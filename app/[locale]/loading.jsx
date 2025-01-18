'use client'

import { Icon } from '@iconify/react'
import React from 'react'

const Loading = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
      }}
      className='d-flex justify-content-center align-items-center'
    >
      <div className='d-flex justify-content-center align-items-center'>
        <Icon
          icon='line-md:loading-loop'
          className='ml-10'
          width={30}
          height={30}
        />
        {/* <br />
        <p>Loading...</p> */}
      </div>
    </div>
  )
}

export default Loading
