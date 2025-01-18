import Checkbox from '@/components/common/Checkbox'
import CityFinderInput from '@/components/common/CityInput'
import ComboBox from '@/components/common/ComboBox'
import ImageUploader from '@/components/common/ImageUploader'
import Input from '@/components/common/Input'
import { create, update, translate } from '@/lib/services/location'
import { locationSchema, initLocation } from '@/lib/validation/location'
import { genSlug, getLocales } from '@/utils'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const LocationForm = ({ formData, onSuccess, locale, translation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('locations')
  const localeT = useTranslations('localizations')

  const localeOptions = getLocales(locale, formData?.localizations, localeT)

  return (
    <Formik
      initialValues={initLocation(formData)}
      enableReinitialize={true}
      validationSchema={locationSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)

        const formattedValues = {
          ...values,
          id: formData?.id ? formData?.id : null,
          lng: values?.lng?.toString() || '0',
          lat: values?.lat?.toString() || '0',
        }

        let res = null

        if (formData?.id && !translation) {
          res = await update(formattedValues, t('messages.update'))
        } else if (formData?.id && translation) {
          res = await translate(formattedValues, t('messages.translate'))
        } else {
          res = await create(formattedValues, t('messages.create'))
        }
        setIsLoading(false)

        if (res.status === 200 || res.status === 201) {
          onSuccess()
          resetForm()
        }
      }}
    >
      {({ dirty, values, errors, setFieldValue }) => (
        <Form>
          <div className='row x-gap-20 y-gap-20'>
            {/* {translation && (
              <div className='col-12'>
                <Input
                  label='Translation Language'
                  name='locale'
                  type='select'
                  options={localeOptions}
                />
              </div>
            )} */}

            <div className='col-12'>
              <CityFinderInput
                label='City'
                name='city'
                locale={locale}
                value={{
                  cityName: values?.name,
                  country: values?.country,
                  lat: values?.lat,
                  lng: values?.lng,
                  zipCode: values?.zip_code,
                }} // Pass the single city object here
                onChange={value => {
                  setFieldValue('name', value?.cityName)
                  setFieldValue('country', value?.country)
                  setFieldValue('lat', value?.lat)
                  setFieldValue('lng', value?.lng)
                  setFieldValue('zip_code', value?.zipCode)
                }}
                error={errors?.name}
                placeholder='Enter your city'
                keyValue='name' // The key to display as the city name
                extraKeys={['country']}
                required
              />
            </div>

            <div className='col-6'>
              <Input type='number' name='order' label='Order' />
            </div>

            <div className='col-6'>
              <ImageUploader
                label='Upload Banner Image'
                onUpload={value => setFieldValue('image', value)}
                error={errors?.image}
                value={values?.image}
              />
            </div>

            <div className='modal-footer'>
              <button type='reset' className='col-auto button -sm border'>
                Rest
              </button>
              <button
                disabled={!dirty || Object.keys(errors).length > 0 || isLoading}
                type='submit'
                className='col-auto button -sm bg-blue-1 text-white'
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

export default LocationForm
