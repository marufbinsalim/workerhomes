import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const AccessDenied = () => {
  const router = useRouter()
  return (
    <div className='denied-container'>
      <Icon
        icon='line-md:cancel'
        className='denied-icon'
        width={40}
        height={40}
      />
      <h1>Access Denied</h1>
      <p>You don't have permission to view this page</p>

      <button
        className='button -sm -dark-1 bg-blue-1 text-white  col-auto'
        onClick={() => router.back()}
      >
        Go Back
      </button>
    </div>
  )
}

export default AccessDenied
