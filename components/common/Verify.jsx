import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Verify = () => {
  const router = useRouter()
  return (
    <div className='denied-container'>
      <Icon
        icon='eos-icons:bubble-loading'
        className='denied-icon'
        width={40}
        height={40}
      />
      <h6>Authenticating...</h6>
    </div>
  )
}

export default Verify
