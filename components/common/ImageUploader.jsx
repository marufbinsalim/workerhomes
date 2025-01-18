import { useState } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { remove, upload } from '@/lib/services/upload'
import { exactPath } from '@/utils'

const ImageUploader = ({ onUpload, multiple, label, name, error, value }) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const handleFileChange = e => {
    const files = Array.from(e.target.files)
    const maxFileSize = 10 * 1024 * 1024 // 10 MB in bytes

    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        setErrorMessage(
          `File ${file.name} is larger than 512 KB and cannot be uploaded.`
        )
        return false
      }
      return true
    })

    setSelectedFiles(validFiles)
    if (validFiles.length !== files.length) {
      setErrorMessage('Some files were too large and were not added.')
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
      setUploadProgress(0)
      setSelectedFiles([])
      onUpload(response.data)
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
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id='file-input'
      />
      {value && Array.isArray(value) ? (
        value.map((image, index) => (
          <div
            key={index}
            className='d-flex ratio ratio-1:1 w-80 border rounded-4'
          >
            <Image
              width={80}
              height={80}
              src={
                image?.url ? exactPath(image?.url) : '/img/misc/avatar-1.png'
              }
              alt='avatar'
              className='img-ratio rounded-4'
            />
            <div className='d-flex justify-end px-1 py-1 h-100 w-1/1 absolute'>
              <div
                className='size-20 bg-blue-2 text-white rounded-4 flex-center cursor-pointer'
                onClick={e => {
                  e.preventDefault()
                  handleDelete(image?.id)
                }}
              >
                <i className='icon-trash text-12' />
              </div>
            </div>
          </div>
        ))
      ) : !value ? null : (
        <>
          <div className='d-flex ratio ratio-1:1 w-80 border rounded-4'>
            <Image
              width={80}
              height={80}
              src={
                value?.url ? exactPath(value?.url) : '/img/misc/avatar-1.png'
              }
              alt='avatar'
              className='img-ratio rounded-4'
            />
            <div className='d-flex justify-end px-1 py-1 h-100 w-1/1 absolute'>
              <div
                className='size-20 bg-blue-2 text-white rounded-4 flex-center cursor-pointer'
                onClick={e => {
                  e.preventDefault()
                  handleDelete(value?.id)
                }}
              >
                <i className='icon-trash text-12' />
              </div>
            </div>
          </div>
          <p>{label}</p>
        </>
      )}

      {!value && (
        <div>
          <label htmlFor='file-input'>
            <span className='button -sm bg-blue-1 text-white cursor-pointer'>
              <Icon icon='feather:upload' className='mr-4' />
              {label || 'Upload Images'}
            </span>
          </label>
          {error && <div className='invalid-feedback'>{error}</div>}
        </div>
      )}
      {errorMessage && <div className='invalid-feedback'>{errorMessage}</div>}
      {selectedFiles.length > 0 && (
        <div className='mt-3'>
          <h6>Selected {multiple ? 'Images' : 'Image'}:</h6>
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

export default ImageUploader
