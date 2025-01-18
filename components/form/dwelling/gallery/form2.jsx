import ImageUploader2 from '@/components/common/ImageUploader2'
import React from 'react'

const ImageFormTwo = ({ dwellingId, onSuccess, totalImages }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [value, setValue] = React.useState(null)

  return (
    <div>
      <ImageUploader2
        formId={dwellingId}
        label='Upload Image'
        onUpload={value => setValue(value)}
        error={error}
        value={value}
        order={totalImages}
        onSuccess={onSuccess}
      />
    </div>
  )
}

export default ImageFormTwo
