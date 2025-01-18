'use client'

import { useState, useEffect, useMemo } from 'react'
import { setAuthorization, APIClient } from '@/lib/services/api'
import qs from 'qs'
import { toast } from 'react-toastify'

const api = APIClient()

const useFetch = ({ keys, url, query = null, params = null }) => {
  const [data, setData] = useState({
    data: null,
    pagination: null,
  })
  const [meta, setMeta] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const URI = useMemo(() => {
    return query
      ? `${url}?${qs.stringify(query, { encodeValuesOnly: true })}`
      : url
  }, [url, query])

  const fetchData = async () => {
    setIsLoading(true)

    try {
      const { data, meta } = await api.get(URI, params)
      setData({
        data: data || null,
        pagination: meta?.pagination || null,
      })
    } catch (error) {
      setError(error)
      toast.error(error?.message || 'An error occurred while fetching data.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [...keys, URI])

  const reFetch = () => {
    fetchData()
  }

  return {
    isLoading,
    reFetch,
    data: data?.data?.data ? data?.data?.data : data?.data,
    pagination: data?.data?.meta?.pagination,
    error,
  }
}

export default useFetch
