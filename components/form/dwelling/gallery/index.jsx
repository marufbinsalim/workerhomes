import Checkbox from '@/components/common/Checkbox'
import ComboBox from '@/components/common/ComboBox'
import ImageUploader from '@/components/common/ImageUploader'
import Input from '@/components/common/Input'
import { create, update } from '@/lib/services/dwelling/gallery'
import { gallerySchema, initGallery } from '@/lib/validation/dwelling/gallery'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const GalleryForm = ({ formData, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('galleries')
  const localeT = useTranslations('localizations')

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true)

    const formattedValues = {
      ...values,
      id: formData?.id ? formData?.id : null,
    }

    let res = null

    if (formData?.id) {
      res = await update(formattedValues, t('messages.update'))
    } else {
      res = await create(formattedValues, t('messages.create'))
    }

    setIsLoading(false)

    if (res.status === 200 || res.status === 201 || res.status === 204) {
      onSuccess()
      resetForm()
    }
  }

  return (
    <Formik
      initialValues={initGallery(formData)}
      enableReinitialize={true}
      validationSchema={gallerySchema()}
      onSubmit={handleSubmit}
    >
      {({ dirty, values, errors, setFieldValue }) => {
        return (
          <Form>
            <div className='row x-gap-20 y-gap-20'>
              <div className='col-6'>
                <Input type='number' name='order' label='Placement Order' />
              </div>

              <div className='col-6'>
                <Input rows={1} type='textarea' name='note' label='Note' />
              </div>

              <div className='col-12'>
                <ImageUploader
                  label='Upload Image'
                  onUpload={value => setFieldValue('image', value)}
                  error={errors?.image}
                  value={values?.image}
                />
              </div>

              <div className=' modal-footer'>
                <button type='reset' className='col-auto button -sm border'>
                  Rest
                </button>
                <button
                  disabled={
                    !dirty || Object.keys(errors).length > 0 || isLoading
                  }
                  type='submit'
                  className='col-auto button -sm bg-blue-1 text-white  '
                >
                  {formData?.id ? 'Update' : 'Create'}
                  <Icon
                    icon={
                      isLoading
                        ? 'line-md:loading-loop'
                        : formData?.id
                        ? 'mage:edit-fill'
                        : 'ph:plus-bold'
                    }
                    className='ml-10'
                    width={15}
                    height={15}
                  />
                </button>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default GalleryForm
