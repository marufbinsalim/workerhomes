import { useState } from 'react'
import { Icon } from '@iconify/react'
import { remove, upload } from '@/lib/services/upload'
import { exactPath } from '@/utils'

const PDFUploader = ({ onUpload, multiple, label, name, error, value }) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const handleFileChange = e => {
    const files = Array.from(e.target.files)
    const maxFileSize = 512 * 1024 // 512 KB in bytes

    const validFiles = files.filter(file => {
      if (file.type !== 'application/pdf') {
        setErrorMessage(
          `File ${file.name} is larger than 512 KB and cannot be uploaded.`
        )
        return false
      }
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
      setErrorMessage('file is larger than 512 KB and cannot be uploaded.')
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
      onUpload && onUpload(response?.data?.[0])
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
        accept='application/pdf'
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id='file-input'
      />

      {!value && (
        <div>
          <label htmlFor='file-input'>
            <span className='button -sm bg-blue-1 text-white cursor-pointer'>
              <Icon icon='feather:upload' className='mr-4' />
              {label || 'Upload PDF'}
            </span>
          </label>
          {error && <div className='invalid-feedback'>{error}</div>}
        </div>
      )}
      {value && (
        <div className='row '>
          <a
            href={exactPath(value?.url)}
            className='button -sm text-white bg-blue-1 col-3'
          >
            Download <Icon icon='mingcute:download-2-line' className='ml-20' />
          </a>
          <button
            className='button -sm text-white bg-blue-1 col-3 ml-10'
            onClick={() => {
              handleDelete(value?.id)
            }}
          >
            Delete <Icon icon='fluent:delete-16-filled' className='ml-20' />
          </button>
        </div>
      )}
      {errorMessage && <div className='invalid-feedback'>{errorMessage}</div>}
      {selectedFiles.length > 0 && (
        <div className='mt-3'>
          <h6>Selected {multiple ? 'Files' : 'File'}:</h6>
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

export default PDFUploader
