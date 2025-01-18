import { tryCatch } from '@/utils'
import { APIClient } from '@/lib/services/api'

const service = APIClient()

export const create = async (data, message) =>
  await tryCatch(service.create, message)('/api/packages', { data })

export const update = async (data, message) =>
  await tryCatch(service.put, message)(`/api/packages/${data?.id}`, {
    data,
  })

export const remove = async (id, message) =>
  await tryCatch(service.remove, message)(`/api/packages/${id}`)

export const translate = async (data, message) =>
  await tryCatch(service.create, message)(
    `/api/packages/${data?.id}/localizations`,
    {
      ...data,
      id: null,
      publishedAt: new Date(),
    }
  )
export const stripeCreate = async data =>
  await fetch('/api/stripe/package', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .catch(err => console.error(err))

export const stripeUpdate = async data =>
  await fetch(`/api/stripe/package`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .catch(err => console.error(err))
