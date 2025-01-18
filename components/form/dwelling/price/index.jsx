import ImageUploader from '@/components/common/ImageUploader'
import Input from '@/components/common/Input'
import { create, update } from '@/lib/services/dwelling/price'
import { initPrice, priceSchema } from '@/lib/validation/dwelling/price'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const PriceForm = ({ assignedType, formData, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('prices')
  const tType = useTranslations('accommodation-types')

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true)

    const formattedValues = {
      ...values,
      id: formData?.id ? formData?.id : null,
      dwellings: formData?.dwelling,
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

  let options = [
    {
      label: tType('SELECT TYPE'),
      value: '',
    },
    {
      label: tType('SINGLE ROOMS'),
      value: 'SINGLE ROOMS',
    },
    {
      label: tType('DOUBLE ROOMS'),
      value: 'DOUBLE ROOMS',
    },
    {
      label: tType('SHARED ROOMS'),
      value: 'SHARED ROOMS',
    },
    {
      label: tType('WHOLE ACCOMMODATION'),
      value: 'WHOLE ACCOMMODATION',
    },
  ]

  options = options.filter(item => !assignedType.includes(item.value))

  return (
    <Formik
      initialValues={initPrice(formData)}
      enableReinitialize={true}
      validationSchema={priceSchema()}
      onSubmit={handleSubmit}
    >
      {({ dirty, values, errors, setFieldValue }) => {
        return (
          <Form>
            <div className='row x-gap-20 y-gap-20'>
              {!formData?.id && assignedType?.length < 4 && (
                <Input
                  label={t('form.fields.type')}
                  name='type'
                  type='select'
                  options={options}
                />
              )}
              <div className='col-md-4 col-12'>
                <Input
                  type='number'
                  name='amount'
                  label={t('form.fields.price')}
                />
              </div>

              <div className='col-md-4 col-12'>
                <Input
                  type='number'
                  name='guest'
                  label={t('form.fields.guest')}
                />
              </div>

              <div className='col-md-4 col-12'>
                <Input
                  type='number'
                  name='min_stay'
                  label={t('form.fields.min_stay')}
                />
              </div>

              <div className='col-md-4 col-12'>
                <Input
                  type='number'
                  name='total'
                  label={t('form.fields.rooms')}
                />
              </div>

              <div className='modal-footer d-flex gap-4'>
                <button
                  disabled={
                    !dirty || Object.keys(errors).length > 0 || isLoading
                  }
                  type='submit'
                  className='col-auto button -sm bg-blue-1 text-white  '
                >
                  {formData?.id ? t('edit') : t('create')}
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

export default PriceForm
