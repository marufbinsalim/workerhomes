import Input from '@/components/common/Input'
import { create, translate, update } from '@/lib/services/location/country'
import { countrySchema, initCountry } from '@/lib/validation/location/country'
import { getLocales } from '@/utils'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const CountryForm = ({ formData, onSuccess, locale, translation = false }) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('dwelling-amenities')
  const localeT = useTranslations('localizations')

  const localeOptions = getLocales(locale, formData?.localizations, localeT)

  return (
    <Formik
      initialValues={initCountry(formData)}
      enableReinitialize={true}
      validationSchema={countrySchema}
      onSubmit={async (values, { resetForm }) => {
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
          res = await create(
            { ...formattedValues, locale },
            t('messages.create')
          )
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
            <div className='col-6'>
              <Input type='text' name='name' label='Name' />
            </div>

            <div className='col-6'>
              <Input type='text' name='code' label='Phone Code' />
            </div>

            <div className='col-12'>
              <Input type='text' name='currency' label='Currency' />
            </div>

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

export default CountryForm
