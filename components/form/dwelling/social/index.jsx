import ComboBox from '@/components/common/ComboBox'
import Divider from '@/components/common/Divider'
import Input from '@/components/common/Input'
import KeyValueList from '@/components/common/KeyValue'
import Link from '@/components/common/Link'
import LocationPicker from '@/components/common/LocationPicker'
import { update } from '@/lib/services/dwelling'
import { initSocial, socialSchema } from '@/lib/validation/dwelling/social'
import { getActiveSocialPlatforms } from '@/utils'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const DwellingSocialForm = ({ formData, locale, onSuccess, user }) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('address')
  const tLocale = useTranslations('header')
  const tSocial = useTranslations('social')

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true)

      const formattedValues = {
        ...values,
        user: user,
        location: [values?.location],
        id: formData?.id ? formData?.id : null,
      }

      let res = null

      if (formData?.id) {
        res = await update(formattedValues, t('messages.update'))
      }

      setIsLoading(false)

      if (res.status === 200 || res.status === 201 || res.status === 204) {
        onSuccess && onSuccess({ ...formData, ...res.data })
        resetForm()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const allowedSocial = getActiveSocialPlatforms({
    ...formData?.subscription?.package?.roles,
    whatsapp: true,
  })

  return (
    <Formik
      initialValues={initSocial(formData)}
      enableReinitialize={true}
      validationSchema={socialSchema}
      onSubmit={handleSubmit}
    >
      {({ dirty, values, errors, setFieldValue }) => {
        return (
          <Form>
            <div className='row x-gap-20 y-gap-20'>
              <KeyValueList
                t={tSocial}
                label={tSocial('title')}
                error={errors?.contact?.toString()}
                keyValueList={values.contact}
                setKeyValueList={item => setFieldValue('contact', item)}
                allowedSocial={allowedSocial}
                open={true}
              />

              {/* <div className='col-12'>
                <Input
                  required
                  type='select'
                  options={[
                    { value: 'pl', label: tLocale(`locales.pl.language`) },
                    { value: 'en', label: tLocale(`locales.en.language`) },
                    { value: 'de', label: tLocale(`locales.de.language`) },
                  ]}
                  name='service_lang'
                  label={t('form.fields.service_lang')}
                />
              </div> */}

              <Divider title={t('title')} />

              <div className='col-12'>
                <Input
                  type='text'
                  name='location.street_one'
                  label={t('form.fields.first_line')}
                  required
                />
              </div>

              {/* <div className='col-6'>
                <Input
                  type='text'
                  name='location.street_two'
                  label={t('form.fields.second_line')}
                />
              </div> */}

              <div className='col-4'>
                <Input
                  type='text'
                  name='location.zip_code'
                  label={t('form.fields.zip_code')}
                />
              </div>

              <div className='col-4'>
                <Input
                  type='text'
                  name='location.city'
                  label={t('form.fields.city')}
                  required
                />
              </div>

              <div className='col-4'>
                {/* <p className='fw-700 badge'>{values.location.country}</p> */}

                <Input
                  type='text'
                  name='location.country'
                  label='Country'
                  disabled
                />
              </div>

              <div className='col-12'>
                <Input
                  type='text'
                  name='direction'
                  label={t('form.fields.direction')}
                />
              </div>
              <LocationPicker
                t={t}
                value={{
                  city: values?.location?.city,
                  country: values?.location?.country,
                  street: values?.location?.street_one,
                  // street2: values?.location?.street_two,
                  zip_code: values?.location?.zip_code,
                  coordinates: values.location.geo,
                }}
                onChange={value => {
                  setFieldValue('location.city', value.city)
                  setFieldValue('location.country', value.country)
                  setFieldValue('location.street_one', value.street)
                  // setFieldValue('location.street_two', value.street2 || '')
                  setFieldValue('location.zip_code', value.zip_code)
                  setFieldValue('location.geo', value?.coordinates)
                }}
              />

              <div className=' modal-footer'>
                <button type='reset' className='col-auto button -sm border'>
                  {t('reset')}
                </button>
                {!formData?.subscription?.id ? (
                  <button
                    disabled={
                      // !dirty ||
                      Object.keys(errors).length > 0 ||
                      isLoading ||
                      !values?.location?.geo?.lng ||
                      !values?.location?.geo?.lat ||
                      !values?.location?.country
                    }
                    type='submit'
                    className='col-auto button -sm bg-blue-1 text-white ml-10 '
                  >
                    {t('create')}
                    <Icon
                      icon={
                        isLoading ? 'line-md:loading-loop' : 'mage:edit-fill'
                      }
                      className='ml-10'
                      width={15}
                      height={15}
                    />
                  </button>
                ) : (
                  <Link
                    href='/dashboard/dwellings'
                    className='col-auto button -sm bg-blue-1 text-white ml-10 '
                  >
                    {t('close')}
                  </Link>
                )}
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default DwellingSocialForm
