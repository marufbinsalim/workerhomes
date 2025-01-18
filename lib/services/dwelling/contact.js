import { tryCatch } from '@/utils'
import { APIClient } from '../api'

const service = APIClient()

export const create = async (data, message) =>
  await tryCatch(service.create, message)('/api/listing-contacts', { data })
