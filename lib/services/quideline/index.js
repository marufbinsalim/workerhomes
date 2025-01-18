import { tryCatch } from '@/utils'
import { APIClient } from '../api'

const service = APIClient()

export const create = async (data, message) =>
  await tryCatch(service.create, message)('/api/guidlines', { data })

export const remove = async (id, message) =>
  await tryCatch(service.remove, message)(`/api/guidlines/${id}`)

export const update = async (data, message) =>
  await tryCatch(service.put, message)(`/api/guidlines/${data.id}`, { data })
