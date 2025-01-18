import { useBreadcrumbs } from '@/context/Breadcrumb'
import React from 'react'

const Breadcrumbs = () => {
  const { breadcrumbs } = useBreadcrumbs()

  return (
    <nav aria-label='breadcrumb'>
      <ol className='breadcrumb'>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className='breadcrumb-item'>
            {breadcrumb}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
