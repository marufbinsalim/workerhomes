'use client'

import Input from '@/components/common/Input'
import Link from '@/components/common/Link'
import { signUp } from '@/lib/services/auth'
import { authSchema } from '@/lib/validation/auth'
import { Icon } from '@iconify/react'
import { Formik, Form } from 'formik'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { toast } from 'react-toastify'

const SignUpForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const locale = useParams().locale
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  })
  const t = useTranslations('register')
  const router = useRouter()

  return (
    <Formik
      initialValues={{
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        username: '',
        confirm_password: '',
      }}
      enableReinitialize={true}
      validationSchema={authSchema.signUp}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)
        try {
          if (!executeRecaptcha) {
            setIsLoading(false)
            return toast.error(t('message.recaptcha-not-ready'))
          }

          const token = await executeRecaptcha('login')

          const recaptchaResponse = await fetch('/api/recaptcha', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          })

          const recaptchaData = await recaptchaResponse.json()

          if (!recaptchaData.success) {
            setIsLoading(false)
            return toast.error(t('message.recaptcha-failed'))
          }

          toast.success(t('message.recaptcha-success'))

          const res = await signUp({
            identifier: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            password: values.password,
          })

          if (
            res?.status === 200 ||
            res?.status === 201 ||
            res?.status === 401
          ) {
            toast.success(t('message.success'))
            router.push(`/${locale}`)
          }
        } catch (error) {
          toast.error(t('message.error'))
        } finally {
          setIsLoading(false)
        }
      }}
    >
      {({ dirty, values, errors, setFieldValue }) => (
        <Form>
          <div className='row x-gap-20 y-gap-20'>
            <div className='col-12'>
              <h1 className='text-22 fw-500'>{t('title')}</h1>
              <p className='mt-10'>
                {t('message.text')}{' '}
                <Link href='/login' className='text-blue-1'>
                  {t('message.link')}
                </Link>
              </p>
            </div>
            {/* End .col */}

            <div className='col-6'>
              <Input
                label={t('form.firstname')}
                type='text'
                name='first_name'
                disabled={isLoading}
                required
              />
            </div>
            {/* End .col */}

            <div className='col-6'>
              <Input
                label={t('form.lastname')}
                type='text'
                name='last_name'
                disabled={isLoading}
                required
              />
            </div>
            {/* End .col */}

            <div className='col-12'>
              <Input
                label={t('form.email')}
                type='email'
                name='email'
                disabled={isLoading}
                required
              />
            </div>
            {/* End .col */}

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
                label={t('form.password')}
                name='password'
                type={showPassword.password ? 'text' : 'password'}
                disabled={isLoading}
                required
              />
            </div>
            {/* End .col */}

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
                label={t('form.confirm')}
                type={showPassword.confirmPassword ? 'text' : 'password'}
                name='confirm_password'
                disabled={isLoading}
                required
              />
            </div>
            {/* End .col */}

            {/* <div className='col-12'>
              <div className='d-flex '>
                <div className='form-checkbox mt-5'>
                  <input type='checkbox' name='name' />
                  <div className='form-checkbox__mark'>
                    <div className='form-checkbox__icon icon-check' />
                  </div>
                </div>
                <div className='text-15 lh-15 text-light-1 ml-10'>
                  {t('form.privacy')}
                </div>
              </div>
            </div> */}
            {/* End .col */}

            <div className='col-12'>
              <button
                type='submit'
                disabled={!dirty || Object.keys(errors).length > 0 || isLoading}
                className='button py-20 -dark-1 bg-blue-1 text-white w-100'
              >
                {t('form.button')}{' '}
                <Icon
                  icon={
                    isLoading
                      ? 'line-md:loading-loop'
                      : 'solar:login-3-line-duotone'
                  }
                  className='ml-10'
                  width={20}
                  height={20}
                />
              </button>
            </div>
            {/* End .col */}
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default SignUpForm
