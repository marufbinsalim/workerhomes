import { tryCatch } from '@/utils'
import { APIClient } from '../api'

const service = APIClient()

export const create = async (data, message) =>
  await tryCatch(service.create, message)('/api/prices', { data })

export const update = async (data, message) =>
  await tryCatch(service.put, message)(`/api/prices/${data?.id}`, {
    data,
  })

export const remove = async (id, message) =>
  await tryCatch(service.remove, message)(`/api/prices/${id}`)

export const modify = async (id, data, message) => {
  const result = await tryCatch(service.create, message)(`/api/prices/modify`, {
    data,
  })

  await tryCatch(service.put, '')(`/api/dwellings/${id}/sync`, {})

  return result
}
