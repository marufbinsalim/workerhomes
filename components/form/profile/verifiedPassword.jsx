import Input from '@/components/common/Input'
import { update, verifyPassword } from '@/lib/services/user'
import { profilePWDVerifySchema } from '@/lib/validation/profile'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'react-toastify'

const PasswordVerifiedForm = ({ formData, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    password: false,
    confirmPassword: false,
  })
  const t = useTranslations('profile')
  const localeT = useTranslations('localizations')
  const { data: session } = useSession()

  return (
    <Formik
      initialValues={{
        password: '',
        confirm_password: '',
      }}
      enableReinitialize={true}
      validationSchema={profilePWDVerifySchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)

        const formattedValues = {
          password: values.password,
          id: formData?.id,
        }

        try {
          const isPasswordValid = await verifyPassword({
            id: formData?.id,
            password: values?.password,
          })

          if (!isPasswordValid) {
            setIsLoading(false)
            return toast.error(t('messages.invalid-password'))
          } else {
            toast.success(t('messages.password-verified'))
            onSuccess(true)
            resetForm()
          }
        } catch (error) {
          if (error.response.status === 400) {
            toast.error(t('messages.invalid-password'))
            resetForm()
          }
        } finally {
          setIsLoading(false)
        }
      }}
    >
      {({ dirty, values, errors, setFieldValue }) => (
        <Form>
          <div className='row x-gap-20 y-gap-20'>
            <div className='col-12'>
              <Input
                action={{
                  icon: showPassword.currentPassword
                    ? 'iconamoon:eye-off-duotone'
                    : 'ph:eye-duotone',
                  onClick: () =>
                    setShowPassword(prev => ({
                      ...prev,
                      currentPassword: !showPassword.currentPassword,
                    })),
                }}
                label={t('form.field.current-password')}
                type={showPassword.currentPassword ? 'text' : 'password'}
                name='password'
                disabled={isLoading}
                required
              />
            </div>
            <div className='modal-footer'>
              <button
                disabled={!dirty || Object.keys(errors).length > 0 || isLoading}
                type='submit'
                className='col-auto button -sm bg-blue-1 text-white'
              >
                {t('control-panel.submit')}
                <Icon
                  icon={isLoading ? 'line-md:loading-loop' : 'ph:check-bold'}
                  className='ml-10'
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default PasswordVerifiedForm
