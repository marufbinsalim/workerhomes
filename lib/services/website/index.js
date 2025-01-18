'use server'

import { api } from '@/config'
import QueryString from 'qs'

const fetcher = async ({ url, query }) => {
  const path = `${api + url}?${QueryString.stringify(query)}`

  try {
    const res = await fetch(path, {
      next: {
        revalidate: 0,
      },
    })
    const data = await res.json()
    return { data: data?.data || null, pagination: data?.pagination || null }
  } catch (error) {
    throw new Error('ERROR FETCHING DATA', error?.message)
  }
}

export const getAllDwellings = async ({ query }) => {
  return await fetcher({
    url: '/api/dwellings',
    query,
  })
}

export const getDwellingBySlug = async ({ slug, revalidate = 1 }) => {
  return await fetcher({
    url: '/api/dwellings',
    query: {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: ['image', 'category'],
    },
  })
}

export const getAllCities = async ({ query, revalidate = 1 }) => {
  return await fetcher({
    url: '/api/cities',
    query,
  })
}
