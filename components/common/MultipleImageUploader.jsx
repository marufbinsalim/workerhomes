import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { remove, upload } from '@/lib/services/upload'
import { remove as RemoveGallery } from '@/lib/services/dwelling/gallery'
import { exactPath } from '@/utils'
import SortableList, { SortableItem } from 'react-easy-sort'
import { useTranslations } from 'next-intl'

const MultipleImageUploader = ({
  onUpload,
  label,
  name,
  error,
  value,
  onDelete,
  limit, // Added limit prop
}) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const t = useTranslations('image-uploader')

  const handleFileChange = e => {
    const files = Array.from(e.target.files)
    const maxFileSize = 10 * 1024 * 1024 // 10 MB in bytes

    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        setErrorMessage(`${file.name} ${t('larger')}`)
        return false
      }
      return true
    })

    const totalFiles = uploadedFiles.length + validFiles.length

    if (totalFiles > limit) {
      setErrorMessage(`${t('allowed')} ${limit} ${t('images')}.`)
      return
    }

    setSelectedFiles(prevFiles => [...prevFiles, ...validFiles])

    if (validFiles.length !== files.length) {
      setErrorMessage(t('error'))
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
      const newUploadedFiles = response.data.map((file, index) => ({
        id: null,
        order: uploadedFiles.length + index + 1,
        isDefault: uploadedFiles.length === 0 && index === 0,
        image: {
          id: file.id,
          url: file.url,
          formats: file.formats,
        },
      }))

      setUploadProgress(0)
      const updatedFiles = [...uploadedFiles, ...newUploadedFiles]
      setUploadedFiles(updatedFiles)
      setSelectedFiles([])
      onUpload(updatedFiles)
    }
  }

  const handleDelete = async (id, gId) => {
    if (id) {
      const res = await remove(id)
      if (res) {
        const updatedFiles = uploadedFiles.filter(file => file.image.id !== id)
        setUploadedFiles(updatedFiles)
        onUpload(updatedFiles)
      }
    }
    if (gId) {
      await RemoveGallery(gId, '')
      onDelete && onDelete()
    }
  }

  const handleSetDefault = id => {
    const updatedFiles = uploadedFiles.map(file => ({
      ...file,
      isDefault: file?.image.id === id,
    }))
    setUploadedFiles(updatedFiles)
    onUpload(updatedFiles)
  }

  const onSortEnd = (oldIndex, newIndex) => {
    const reorderedFiles = Array.from(uploadedFiles)
    const [removed] = reorderedFiles.splice(oldIndex, 1)
    reorderedFiles.splice(newIndex, 0, removed)

    const reorderedFilesWithOrder = reorderedFiles.map((file, index) => ({
      ...file,
      order: index + 1,
    }))

    setUploadedFiles(reorderedFilesWithOrder)
    onUpload(reorderedFilesWithOrder)
  }

  useEffect(() => {
    if (value) {
      setUploadedFiles(value)
    }
  }, [value])

  return (
    <div>
      {uploadedFiles.length < limit && !selectedFiles?.length && (
        <>
          <input
            type='file'
            accept='image/jpeg, image/jpg, image/png'
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id='file-input'
            disabled={uploadedFiles.length >= limit} // Disable file input if limit is reached
          />
          <label htmlFor='file-input'>
            <span className='button -sm bg-blue-1 text-white cursor-pointer'>
              <Icon icon='feather:upload' className='mr-4' />
              {label || t('upload')}
            </span>
          </label>
        </>
      )}
      {error && <div className='invalid-feedback'>{error}</div>}
      {errorMessage && <div className='invalid-feedback'>{errorMessage}</div>}

      {selectedFiles.length > 0 && (
        <div className='mt-3'>
          <h6>{t('selected')}:</h6>
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
                  {t('remove')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedFiles.length > 0 && selectedFiles.length <= limit && (
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
            {t('upload2')}
          </button>
        </div>
      )}
      {uploadProgress > 0 && <progress value={uploadProgress} max={100} />}

      <SortableList
        onSortEnd={onSortEnd}
        className='mt-30 row x-gap-10 y-gap-10'
        draggedItemClassName='dragged'
      >
        {uploadedFiles
          ?.sort((a, b) => a.order - b.order)
          ?.map((image, index) => (
            <div className='col-3' key={index}>
              <SortableItem>
                <div className='ratio ratio-1:1 w-150 border rounded-4 mx-2'>
                  {image?.image?.url && (
                    <Image
                      width={150}
                      height={150}
                      src={exactPath(
                        image?.image?.formats?.thumbnail?.url ||
                          image?.image?.url
                      )}
                      alt='avatar'
                      className='img-ratio rounded-4 col-1'
                    />
                  )}
                  <div className='d-flex justify-between px-1 py-1 w-1/1'>
                    <div
                      className='size-40 bg-red-2 text-white rounded-4 flex-center cursor-pointer'
                      onClick={e => {
                        e.preventDefault()
                        handleDelete(image?.image?.id, image?.id)
                      }}
                    >
                      <i className='icon-trash text-12' />
                    </div>
                    {image.order === 1 && (
                      <div
                        className={`size-40 ${
                          image.order === 1
                            ? 'bg-blue-1 text-white'
                            : 'bg-gray text-brand'
                        } border rounded-4 flex-center cursor-pointer`}
                        onClick={e => {
                          e.preventDefault()
                          handleSetDefault(image.image.id)
                        }}
                      >
                        <i className='icon-star text-12' />
                      </div>
                    )}
                  </div>
                </div>
              </SortableItem>
            </div>
          ))}
      </SortableList>
    </div>
  )
}

export default MultipleImageUploader
