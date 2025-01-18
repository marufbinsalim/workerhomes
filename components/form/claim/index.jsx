'use client'

import Input from '@/components/common/Input'
import Link from '@/components/common/Link'
import { create } from '@/lib/services/claim'
import { claimSchema, initClaim } from '@/lib/validation/claim'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { toast } from 'react-toastify'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const ClaimForm = ({ dwelling, onSuccess }) => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isLoading, setIsLoading] = React.useState(false)
  const t = useTranslations('claim')

  const { data: session } = useSession()

  if (!session?.id)
    return (
      <div>
        <p className='text-center py-10'>{t('messages.signin')} </p>
        <Link
          className='button px-24 h-50 -dark-1 bg-blue-1 text-white'
          href='/login'
        >
          {t('control-panel.login')}
        </Link>
      </div>
    )

  return (
    <Formik
      initialValues={initClaim({
        email: session?.user?.email,
      })}
      enableReinitialize={true}
      validationSchema={claimSchema}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)

        if (!executeRecaptcha) {
          setIsLoading(false)
          return toast.error(t('messages.recaptcha-not-ready'))
        }

        const formattedValues = {
          ...values,
          listing: dwelling?.id,
          user: session?.id,
        }

        try {
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
            return toast.error(t('messages.recaptcha-failed'))
          }

          toast.success(t('messages.recaptcha-success'))

          await create(formattedValues, t('messages.create'))
          onSuccess && onSuccess()
          resetForm()
        } catch (error) {
          console.log(error)
          toast.error(t('messages.error'))
        } finally {
          setIsLoading(false)
        }
      }}
    >
      {({ dirty, values, errors, setFieldValue }) => (
        <Form>
          <div className='row x-gap-20 y-gap-20'>
            <div className='col-sm-12 col-md-6'>
              <Input
                type='text'
                name='first_name'
                label={t('form.first_name')}
                required
              />
            </div>
            <div className='col-sm-12 col-md-6'>
              <Input
                type='text'
                name='last_name'
                label={t('form.last_name')}
                required
              />
            </div>

            <div className='col-12'>
              <Input
                type='email'
                name='email'
                label={t('form.email')}
                required
              />
            </div>

            <div className='col-12'>
              <Input
                type='textarea'
                name='description'
                rows={5}
                required
                label={t('form.description')}
              />
            </div>

            <div className='col-12'>
              <button
                type='submit'
                disabled={!dirty || isLoading}
                className='button px-24 h-50 -dark-1 bg-blue-1 text-white'
              >
                {t('form.button')}
                <Icon
                  icon={
                    isLoading
                      ? 'line-md:loading-loop'
                      : 'streamline:mail-send-email-message'
                  }
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

export default ClaimForm
