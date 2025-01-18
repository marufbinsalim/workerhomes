import { tryCatch } from '@/utils'
import { APIClient } from '@/lib/services/api'
import axios from 'axios'

const service = APIClient()

export const create = async (data, message) =>
  await tryCatch(service.create, message)('/api/users', data)

export const update = async (data, message) =>
  await tryCatch(service.put, message)(`/api/users/${data?.id}`, data)

export const remove = async (id, message) =>
  await tryCatch(
    service.remove,
    message
  )(`/api/auth/local/remove-account/${id}`)

export const updateMe = async (data, message) =>
  await tryCatch(service.put, message)(`/api/users/me`, data)

export const verifyPassword = async data =>
  await axios.post(`/api/auth/local/verify-password/${data?.id}`, { data })
