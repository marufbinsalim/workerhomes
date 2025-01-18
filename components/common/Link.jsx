'use client'

import NextLink from 'next/link'
import { useParams } from 'next/navigation'

const Link = ({ href, ...props }) => {
  const locale = useParams().locale
  return (
    <NextLink className='text-blue-1' href={`/${locale + href}`} {...props} />
  )
}

export default Link
