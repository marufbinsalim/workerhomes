import axios from 'axios'
import { toast } from 'react-toastify'

export const remove = async id => {
  try {
    const res = await axios.delete(`/api/upload/files/${id}`)

    if (res.status === 200) {
      toast.success('Image deleted successfully.')
      return true
    }
  } catch (error) {
    toast.error(
      `Operation has been failed, please try again letter. [${error?.message}]`
    )
    return false
  }
}

export const upload = async (formData, config) => {
  try {
    const res = await axios.post('/api/upload', formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (res.status === 200) {
      return res
    }
  } catch (error) {
    toast.error(
      `Operation has been failed, please try again letter. [${error?.message}]`
    )
    return false
  }
}
