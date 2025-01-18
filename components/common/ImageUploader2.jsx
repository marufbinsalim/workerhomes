import { useState } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { remove, upload } from '@/lib/services/upload'
import { exactPath } from '@/utils'
import { create } from '@/lib/services/dwelling/gallery'

const ImageUploader2 = ({
  formId,
  order = 1,
  label,
  error,
  value,
  onSuccess,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const handleFileChange = e => {
    const files = Array.from(e.target.files)
    const maxFileSize = 10 * 1024 * 1024 // 10 MB in bytes

    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        setErrorMessage(
          `File ${file.name} is larger than 512 MB and cannot be uploaded.`
        )
        return false
      }
      return true
    })

    setSelectedFiles(validFiles)
    if (validFiles.length !== files.length) {
      setErrorMessage(
        'Some files are larger than 512 MB and cannot be uploaded.'
      )
    } else {
      setErrorMessage('')
    }
  }

  const handleRemove = index => {
    setSelectedFiles(prevFiles => {
      const newFiles = [...prevFiles]
      newFiles.splice(index, 1)
      return newFiles
    })
    setErrorMessage('')
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    const maxFileSize = 512 * 1024 * 1024 // 512 MB in bytes
    const oversizedFile = selectedFiles.find(file => file.size > maxFileSize)

    if (oversizedFile) {
      setErrorMessage(
        `File ${oversizedFile.name} is larger than 512 MB and cannot be uploaded.`
      )
      return
    }

    const formData = new FormData()
    selectedFiles.forEach(file => formData.append('files', file))

    const response = await upload(formData, {
      onUploadProgress: progressEvent => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        )
        setUploadProgress(progress)
      },
    })

    if (response) {
      const x = await create(
        { order: order + 1, dwellings: formId, image: response?.data?.[0]?.id },
        'Image uploaded successfully'
      )

      if (x) {
        setUploadProgress(0)
        setSelectedFiles([])
        onSuccess && onSuccess()
      }
    }
  }

  const handleDelete = async id => {
    const res = await remove(id)
    if (res) {
      setSelectedFiles([])
      onUpload(null)
    }
  }

  return (
    <div>
      <input
        type='file'
        accept='image/jpeg, image/jpg, image/png'
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id='file-input'
      />
      {selectedFiles?.length === 0 && (
        <label htmlFor='file-input'>
          <span className='button -sm bg-blue-1 text-white cursor-pointer'>
            <Icon icon='feather:upload' className='mr-4' />
            {label || 'Upload Images'}
          </span>
        </label>
      )}
      {error && <div className='invalid-feedback'>{error}</div>}
      {errorMessage && <div className='invalid-feedback'>{errorMessage}</div>}

      {selectedFiles.length > 0 && (
        <div className='mt-3'>
          <ul className='list-group'>
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className='list-group-item d-flex justify-content-between align-items-center'
              >
                {file.name}
                <span
                  className='badge badge-danger badge-pill text-primary cursor-pointer'
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className='mt-3'>
          <button
            className='btn btn-primary'
            type='button'
            onClick={handleUpload}
            disabled={uploadProgress > 0}
          >
            {uploadProgress > 0 ? (
              <Icon icon='akar-icons:loading' className='mr-2' />
            ) : (
              <Icon icon='ri:cloud-upload-line' className='mr-2' />
            )}
            Upload
          </button>
        </div>
      )}

      {uploadProgress > 0 && <progress value={uploadProgress} max={100} />}
    </div>
  )
}

export default ImageUploader2
