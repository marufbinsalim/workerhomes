import Checkbox from '@/components/common/Checkbox'
import ComboBox from '@/components/common/ComboBox'
import Input from '@/components/common/Input'
import { create, update } from '@/lib/services/subscription'
import {
  initSubscription,
  subscriptionSchema,
} from '@/lib/validation/subscription'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const SubscriptionForm = ({ formData, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('subscription')
  const localeT = useTranslations('localizations')
  const { data: session } = useSession()
  return (
    <Formik
      initialValues={initSubscription(formData)}
      enableReinitialize={true}
      validationSchema={subscriptionSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)

        const formattedValues = {
          ...values,

          user: session?.id,
          stripe_subscription_id: values?.package?.stripe_price_id || '',
          stripe_customer_id: values?.user?.stripe_customer_id || '',
          payment_status: 'active',
          id: formData?.id ? formData?.id : null,
        }

        let res = null

        if (formData?.id) {
          res = await update(formattedValues, t('messages.update'))
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
            <div className='col-12'>
              <ComboBox
                onChange={item => setFieldValue('package', item)}
                label={t('form.fields.package')}
                value={values?.package}
                placeholder={t('control-panel.search')}
                url='/api/packages'
                params={{ filters: { isFree: { $eq: false } } }}
                name='package'
                keyValue='name'
                error={errors?.package}
              />
            </div>

            <div className='col-6'>
              <Input
                type='date'
                name='start_date'
                label={t('form.fields.start')}
              />
            </div>

            <div className='col-6'>
              <Input
                type='date'
                name='end_date'
                label={t('form.fields.end')}
                min={values?.start_date}
              />
            </div>

            <div className='modal-footer'>
              <button type='reset' className='col-auto button -sm border'>
                {t('reset')}
              </button>
              <button
                disabled={!dirty || Object.keys(errors).length > 0 || isLoading}
                type='submit'
                className='col-auto button -sm bg-blue-1 text-white'
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
      )}
    </Formik>
  )
}

export default SubscriptionForm
