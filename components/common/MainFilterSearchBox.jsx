'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import LocationSearch from './LocationSearch'

const MainFilterSearchBox = ({ locale }) => {
  const t = useTranslations('hero')
  const [search, setSearch] = useState('')
  const Router = useRouter()

  const handlePlaceChange = place => {
    const city = place?.address_components?.find(component =>
      component.types.includes('locality')
    )

    setSearch(city?.long_name || '')
  }

  return (
    <div className='js-category-active w-100 '>
      <LocationSearch onPlaceSelected={handlePlaceChange} type='hero' />
    </div>
  )
}

export default MainFilterSearchBox
