import { tryCatch } from '@/utils'
import { APIClient } from '@/lib/services/api'

const service = APIClient()

export const create = async (data, message) =>
  await tryCatch(service.create, message)('/api/subscriptions', { data })

export const update = async (data, message) =>
  await tryCatch(service.put, message)(`/api/subscriptions/${data?.id}`, {
    data,
  })

export const remove = async (id, message) =>
  await tryCatch(service.remove, message)(`/api/subscriptions/${id}`)

export const createTrail = async (data, message) =>
  await tryCatch(service.create, message)('/api/subscriptions/free-trail', {
    data,
  })
