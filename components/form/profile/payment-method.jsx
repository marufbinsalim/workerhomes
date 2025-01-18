import Input from '@/components/common/Input'
import { paymentMethods } from '@/config'
import { update } from '@/lib/services/user'
import {
  initPaymentMethod,
  paymentMethodSchema,
} from '@/lib/validation/profile'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState } from 'react'

const PaymentMethodForm = ({ editData, onSuccess }) => {
  const t = useTranslations('profile')
  const [isLoading, setIsLoading] = useState(false)
  const locale = useParams().locale
  const { data: session } = useSession()

  return (
    <Formik
      initialValues={initPaymentMethod(editData)}
      enableReinitialize={true}
      profileSchema
      validationSchema={paymentMethodSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)

        const formattedValues = {
          paymentMethod: values?.paymentMethod,
          id: editData?.id,
        }

        try {
          const res = await update(
            formattedValues,
            t('messages.payment-method')
          )

          if (res.status === 200 || res.status === 201) {
            onSuccess()
            resetForm()
          }
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      }}
    >
      {({ dirty, values, errors, setFieldValue }) => (
        <Form>
          <div className='col-6'>
            <Input
              required
              type='select'
              options={paymentMethods}
              name='paymentMethod'
              label={t('form.field.payment-method')}
            />
          </div>

          <div className='modal-footer'>
            <button
              disabled={isLoading}
              type='submit'
              className='col-auto button -sm bg-blue-1 text-white'
            >
              {t('control-panel.edit')}
              <Icon
                icon={isLoading ? 'line-md:loading-loop' : 'mage:edit-fill'}
                className='ml-10'
                width={15}
                height={15}
              />
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default PaymentMethodForm
