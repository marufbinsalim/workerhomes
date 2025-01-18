import { tryCatch } from '@/utils'
import { APIClient } from '@/lib/services/api'

const service = APIClient()

export const create = async (data, message) =>
  await tryCatch(service.create, message)('/api/claims', { data })

export const update = async (data, message) =>
  await tryCatch(service.put, message)(`/api/claims/${data?.id}`, {
    data,
  })

export const approve = async data =>
  await tryCatch(service.put, 'Claim successfully Approved')(
    `/api/claims/${data?.id}/approve`,
    {
      data: { dwelling: data?.dwelling },
    }
  )
