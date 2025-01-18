import axios from 'axios'
import { api } from '@/config'
import { getSession } from 'next-auth/react'

axios.defaults.baseURL = api
axios.defaults.headers.post['Content-Type'] = 'application/json'

// export const setAuthorization = token => {
//   if (token) {
//     axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.jwt
//   }
// }

export const setAuthorization = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

export const APIClient = () => {
  const get = async (url, params) => {
    const session = await getSession()

    if (session) {
      setAuthorization(session?.jwt)
    }

    try {
      if (params) {
        const response = await axios.get(url, params)
        return response
      }

      const response = await axios.get(url)
      return response
    } catch (error) {
      throw error
    }
  }

  const create = async (url, data) => {
    try {
      const session = await getSession()

      if (session) {
        setAuthorization(session?.jwt)
      }

      return await axios.post(url, data)
    } catch (error) {
      throw error
    }
  }

  const update = async (url, data) => {
    try {
      const session = await getSession()

      if (session) {
        setAuthorization(session?.jwt)
      }
      return await axios.patch(url, data)
    } catch (error) {
      throw error
    }
  }

  const put = async (url, data) => {
    try {
      const session = await getSession()

      if (session) {
        setAuthorization(session?.jwt)
      }

      return await axios.put(url, data)
    } catch (error) {
      throw error
    }
  }

  const remove = async (url, config) => {
    try {
      const session = await getSession()

      if (session) {
        setAuthorization(session?.jwt)
      }

      const response = await axios.delete(url, { ...config })
      return response
    } catch (error) {
      throw error
    }
  }

  const upload = async (url, data, config) => {
    try {
      const session = await getSession()

      if (session) {
        setAuthorization(session?.jwt)
      }

      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...config,
      })
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    get,
    create,
    update,
    put,
    remove,
    upload,
  }
}
