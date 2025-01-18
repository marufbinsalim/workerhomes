import { tryCatch } from '@/utils'
import { APIClient } from '@/lib/services/api'

const service = APIClient()

export const create = async (data, message) =>
  await tryCatch(service.create, message)('/api/contacts', { data })
