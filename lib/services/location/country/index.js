import { tryCatch } from '@/utils'
import { APIClient } from '@/lib/services/api'

const service = APIClient()

export const create = async (data, message) =>
  await tryCatch(service.create, message)('/api/countries', { data })

export const update = async (data, message) =>
  await tryCatch(service.put, message)(`/api/countries/${data?.id}`, {
    data,
  })

export const remove = async (id, message) =>
  await tryCatch(service.remove, message)(`/api/countries/${id}`)

export const translate = async (data, message) =>
  await tryCatch(service.create, message)(
    `/api/countries/${data?.id}/localizations`,
    {
      ...data,
      id: null,
      publishedAt: new Date(),
    }
  )
