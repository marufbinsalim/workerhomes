import { tryCatch } from '@/utils'
import { APIClient } from '../api'

const service = APIClient()

export const create = async (data, message) => {
  const createdItem = await tryCatch(service.create, message)(
    '/api/dwellings?populate=subscription.package,package,features,category,guidline,amenities',
    { data }
  )

  const locales = ['en', 'pl', 'de']?.filter(locale => locale !== data?.locale)

  if (createdItem?.status === 200 || createdItem?.status === 201) {
    for (let i = 0; i < locales.length; i++) {
      const locale = locales[i]

      try {
        const result = await tryCatch(service.create, '')(
          `/api/dwellings/${createdItem?.data?.data?.id}/localizations`,
          {
            title: 'DEMO BEFORE TRANSLATE',
            locale,
            slug: Math.random().toString(36).substring(7),
            publishedAt: new Date(),
          }
        )
      } catch (error) {
        console.error(error)
      }
    }

    await tryCatch(service.put, '')(
      `/api/dwellings/${createdItem?.data?.data?.id}/sync`,
      {}
    )
  }

  return createdItem
}

export const update = async (data, message) => {
  const updateItem = await tryCatch(service.put, message)(
    `/api/dwellings/${data?.id}?populate=subscription.package,package,features,category,guidline,amenities`,
    {
      data,
    }
  )

  await tryCatch(service.put, '')(
    `/api/dwellings/${updateItem?.data?.data?.id}/sync`,
    {}
  )

  return updateItem
}

export const remove = async (id, message) =>
  await tryCatch(
    service.remove,
    message
  )(
    `/api/dwellings/${id}?populate=subscription.package,package,features,category,guidline,amenities`
  )

export const translate = async (data, message) => {
  const locales = ['en', 'pl', 'de']?.filter(locale => locale !== data?.locale)

  return await Promise.all(
    locales.map(async locale => {
      return await tryCatch(service.create, message)(
        `/api/dwellings/${data?.id}/localizations`,
        {
          title: 'DEMO BEFORE TRANSLATE',
          locale,
          slug: Math.random().toString(36).substring(7),
          publishedAt: new Date(),
        }
      )
    })
  )
}

export const status = async (data, message) =>
  await tryCatch(service.put, message)(`/api/dwellings/${data?.id}/status`, {
    data: {
      status: data?.status,
    },
  })

export const updateFilter = async (data, message) =>
  await tryCatch(service.put, '')(`/api/dwellings/available`, {
    data,
  })

export const getSitemap = async () =>
  await tryCatch(service.get, '')(`/api/sitemap`, {})
