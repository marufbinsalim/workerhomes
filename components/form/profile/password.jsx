import Input from '@/components/common/Input'
import { update, verifyPassword } from '@/lib/services/user'
import { profilePWDSchema } from '@/lib/validation/profile'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'react-toastify'

const PasswordForm = ({ formData, onSuccess }) => {
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
      validationSchema={profilePWDSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)

        const formattedValues = {
          password: values.password,
          id: formData?.id,
        }

        console.log({
          id: formData?.id,
          password: values?.current_password,
        })

        try {
          const isPasswordValid = await verifyPassword({
            id: formData?.id,
            password: values?.current_password,
          })

          if (!isPasswordValid) {
            setIsLoading(false)
            return toast.error(t('messages.invalid-password'))
          } else {
            toast.success(t('messages.password-verified'))
          }

          const res = await update(formattedValues, t('messages.update'))

          setIsLoading(false)

          if (res.status === 200 || res.status === 201) {
            onSuccess()
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
                name='current_password'
                disabled={isLoading}
                required
              />
            </div>

            <div className='col-12'>
              <Input
                action={{
                  icon: showPassword.password
                    ? 'iconamoon:eye-off-duotone'
                    : 'ph:eye-duotone',

                  onClick: () =>
                    setShowPassword(prev => ({
                      ...prev,
                      password: !showPassword.password,
                    })),
                }}
                label={t('form.field.password')}
                name='password'
                type={showPassword.password ? 'text' : 'password'}
                disabled={isLoading}
                required
              />
            </div>

            <div className='col-12'>
              <Input
                action={{
                  icon: showPassword.confirmPassword
                    ? 'iconamoon:eye-off-duotone'
                    : 'ph:eye-duotone',
                  onClick: () =>
                    setShowPassword(prev => ({
                      ...prev,
                      confirmPassword: !showPassword.confirmPassword,
                    })),
                }}
                label={t('form.field.confirm-password')}
                type={showPassword.confirmPassword ? 'text' : 'password'}
                name='confirm_password'
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
                {t('control-panel.edit')}
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

export default PasswordForm
