import Checkbox from '@/components/common/Checkbox'
import Divider from '@/components/common/Divider'
import ImageUploader from '@/components/common/ImageUploader'
import Input from '@/components/common/Input'
import { searchOrder } from '@/config'
import {
  create,
  translate,
  update,
  stripeCreate,
  stripeUpdate,
} from '@/lib/services/package'
import { initPackage, packageSchema } from '@/lib/validation/package'
import { getLocales } from '@/utils'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const PackageForm = ({ formData, onSuccess, locale, translation = false }) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('packages')
  const localeT = useTranslations('localizations')

  const localeOptions = getLocales(locale, formData?.localizations, localeT)

  return (
    <Formik
      initialValues={initPackage(formData)}
      enableReinitialize={true}
      validationSchema={packageSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)

        const formattedValues = {
          ...values,
          id: formData?.id ? formData?.id : null,
          search_position: values?.roles?.search_position?.toString(),
          visibility_radius: values?.roles?.visibility_radius?.toString(),
          isFeatured: values?.roles?.featured,
          icon: values?.icon?.id ? values?.icon?.id : values?.icon?.[0]?.id,
          iconSize: parseInt(values?.iconSize),
          order: parseInt(values?.order),
          roles: {
            ...values?.roles,
            pics: values?.pics,
          },
          isFree: values?.price === 0 ? true : false,
        }

        let res = null
        let stripeRes = null

        try {
          if (formData?.id && !translation) {
            // res = await update(formattedValues, t('messages.update'))
            stripeRes = await stripeUpdate({
              id: formData?.stripe_product_id,
              name: formattedValues?.name,
              description: formattedValues?.description,
              price: formattedValues?.price,
              metadata: formattedValues?.roles,
              stripe_price_id: formData?.stripe_price_id,
            })

            res = await update(
              {
                ...formattedValues,
                stripe_price_id: stripeRes?.newPrice?.id,
              },
              t('messages.update')
            )
          } else if (formData?.id && translation) {
            res = await translate(formattedValues, t('messages.translate'))
          } else {
            stripeRes = await stripeCreate({
              name: formattedValues?.name,
              description: formattedValues?.description,
              metadata: formattedValues?.roles,
              price: formattedValues?.price,
            })
            res = await create(
              {
                ...formattedValues,
                stripe_product_id: stripeRes?.id,
                stripe_price_id: stripeRes?.default_price,
              },
              t('messages.create')
            )
          }

          if (res.status === 200 || res.status === 201) {
            onSuccess && onSuccess()
            resetForm()
          }
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      }}
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
              <Input type='text' name='name' label='Name' required />
            </div>

            <div className='col-12'>
              <Input
                rows={5}
                type='textarea'
                name='description'
                label='Description'
                required
              />
            </div>

            <div className='col-6'>
              <Input
                type='number'
                name='price'
                label='Price / month (USD) '
                min={0}
              />
            </div>

            <div className='col-6'>
              <Checkbox
                label='Recommended'
                onChange={value => setFieldValue('isRecommend', value)}
                value={values.isRecommend}
                error={errors?.isRecommend}
              />
            </div>
            <div className='col-6'>
              <ImageUploader
                name={'icon'}
                label='Upload Map Icon'
                onUpload={value => setFieldValue('icon', value)}
                error={errors?.icon}
                value={values?.icon}
              />
            </div>

            <div className='col-3'>
              <Input
                type='number'
                name='iconSize'
                label='Icon Size (Pixel)'
                min={0}
              />
            </div>

            <div className='col-3'>
              <Input type='number' name='order' label='Order' min={0} />
            </div>

            <Divider title='Package Roles and Features' />
            <div className='col-6'>
              <Input
                type='number'
                name='pics'
                min={1}
                label='Pics (Number of Picture)'
              />
            </div>

            <div className='col-6'>
              <Input
                type='select'
                name='roles.search_position'
                label='Search Position'
                options={searchOrder}
              />
            </div>

            <div className='col-6'>
              <Input
                type='text'
                name='roles.visibility_radius'
                label='Visibility Radius (km)'
              />
            </div>

            <div className='col-6'>
              <Checkbox
                label='Facebook Link'
                onChange={value => setFieldValue('roles.facebook', value)}
                value={values.roles.facebook}
                error={errors?.roles?.facebook}
              />
            </div>

            <div className='col-6'>
              <Checkbox
                label='Instagram Link'
                onChange={value => setFieldValue('roles.instagram', value)}
                value={values.roles.instagram}
                error={errors?.roles?.instagram}
              />
            </div>

            <div className='col-6'>
              <Checkbox
                label='Google Listing Link'
                onChange={value => setFieldValue('roles.google_listing', value)}
                value={values.roles.google_listing}
                error={errors?.roles?.google_listing}
              />
            </div>

            <div className='col-6'>
              <Checkbox
                label='Website'
                onChange={value => setFieldValue('roles.website', value)}
                value={values.roles.website}
                error={errors?.roles?.website}
              />
            </div>

            <div className='col-6'>
              <Checkbox
                label='Visible on featured section'
                onChange={value => setFieldValue('roles.featured', value)}
                value={values.roles.featured}
                error={errors?.roles?.featured}
              />
            </div>

            <div className='modal-footer'>
              <button type='reset' className='col-auto button -sm border'>
                Rest
              </button>
              <button
                // disabled={!dirty || Object.keys(errors).length > 0 || isLoading}
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

export default PackageForm
