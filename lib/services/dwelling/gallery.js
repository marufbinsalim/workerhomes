import { tryCatch } from '@/utils'
import { APIClient } from '../api'
import { data } from '@/components/dashboard/dashboard/db-dashboard/components/ChartMain'

const service = APIClient()

export const create = async (data, message) =>
  await tryCatch(service.create, message)('/api/galleries', { data })

export const update = async (data, message) =>
  await tryCatch(service.put, message)(`/api/galleries/${data?.id}`, {
    data,
  })

export const remove = async (id, message) =>
  await tryCatch(service.remove, message)(`/api/galleries/${id}`)

export const translate = async (data, message) =>
  await tryCatch(service.create, message)(
    `/api/galleries/${data?.id}/localizations`,
    {
      ...data,
      id: null,
      publishedAt: new Date(),
    }
  )

export const modify = async (id, data, message) => {
  const result = await tryCatch(service.put, message)(
    `/api/dwellings/${id}/modify-images`,
    {
      data,
    }
  )

  await tryCatch(service.put, message)(`/api/dwellings/${id}/sync`, {})

  return result
}
