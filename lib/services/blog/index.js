import { tryCatch } from '@/utils'
import { APIClient } from '../api'

const service = APIClient()

export const create = async (data, message) =>
  await tryCatch(service.create, message)('/api/blogs', { data })

export const update = async (data, message) =>
  await tryCatch(service.put, message)(`/api/blogs/${data?.id}`, {
    data,
  })

export const remove = async (id, message) =>
  await tryCatch(service.remove, message)(`/api/blogs/${id}`)

export const translate = async (data, message) =>
  await tryCatch(service.create, message)(
    `/api/blogs/${data?.id}/localizations`,
    {
      ...data,
      id: null,
      publishedAt: new Date(),
    }
  )
