import ImageUploader from '@/components/common/ImageUploader'
import Input from '@/components/common/Input'
import { create, update, translate } from '@/lib/services/dwelling/equipment'
import {
  equipmentSchema,
  initEquipment,
} from '@/lib/validation/dwelling/equipment'
import { getLocales } from '@/utils'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const DwellingEquipmentForm = ({
  formData,
  onSuccess,
  locale,
  translation,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('dwelling-equipments')
  const localeT = useTranslations('localizations')

  const localeOptions = getLocales(locale, formData?.localizations, localeT)

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true)

    const formattedValues = {
      ...values,
      id: formData?.id ? formData?.id : null,
    }

    let res = null

    if (formData?.id && !translation) {
      res = await update(formattedValues, t('messages.update'))
    } else if (formData?.id && translation) {
      res = await translate(formattedValues, t('messages.translate'))
    } else {
      res = await create({ ...formattedValues, locale }, t('messages.create'))
    }

    setIsLoading(false)
    if (res.status === 200 || res.status === 201) {
      onSuccess()
      resetForm()
    }
  }

  return (
    <Formik
      initialValues={initEquipment(formData)}
      enableReinitialize={true}
      validationSchema={equipmentSchema()}
      onSubmit={handleSubmit}
    >
      {({ dirty, values, errors, setFieldValue }) => (
        <Form>
          <div className='row x-gap-20 y-gap-20'>
            {translation && (
              <div className='col-12'>
                <Input
                  label='Translation Language'
                  name='locale'
                  type='select'
                  options={localeOptions}
                />
              </div>
            )}

            <div className='col-12'>
              <Input type='text' name='title' label='Title' />
            </div>

            <div className='col-12'>
              <Input
                rows={5}
                type='textarea'
                name='description'
                label='Description'
              />
            </div>

            <ImageUploader
              label='Upload icon'
              onUpload={value => setFieldValue('icon', value)}
              error={errors?.icon}
              value={values?.icon}
            />

            <div className=' modal-footer'>
              <button type='reset' className='col-auto button -sm border'>
                Rest
              </button>
              <button
                disabled={!dirty || Object.keys(errors).length > 0 || isLoading}
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
      )}
    </Formik>
  )
}

export default DwellingEquipmentForm
