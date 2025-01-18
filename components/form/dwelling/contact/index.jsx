'use client'

import Input from '@/components/common/Input'
import { create } from '@/lib/services/dwelling/contact'
import {
  dwellingContactSchema,
  initDwellingContact,
} from '@/lib/validation/dwelling/contact'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useTranslations } from 'next-intl'
import React from 'react'
import { toast } from 'react-toastify'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const ContactForm = ({ dwelling, onSuccess }) => {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const [isLoading, setIsLoading] = React.useState(false)
  const t = useTranslations('listing-contact')
  return (
    <Formik
      initialValues={initDwellingContact(null)}
      enableReinitialize={true}
      validationSchema={dwellingContactSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)

        if (!executeRecaptcha) {
          setIsLoading(false)
          return toast.error(t('messages.recaptcha-not-ready'))
        }

        const formattedValues = {
          ...values,
          check_in: new Date(values.check_in).toISOString(),
          check_out: new Date(values.check_out).toISOString(),
          dwelling: dwelling?.id,
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
            <div className='col-12'>
              <Input
                type='text'
                name='name_or_company'
                label={t('form.name_or_company')}
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
                type='phone'
                name='phone'
                label={t('form.phone')}
                required
              />
            </div>

            <div className='col-sm-12 col-md-6'>
              <Input
                type='datetime-local'
                name='check_in'
                min={new Date()}
                label={t('form.check_in')}
                required
              />
            </div>

            <div className='col-sm-12 col-md-6'>
              <Input
                type='datetime-local'
                name='check_out'
                label={t('form.check_out')}
                required
              />
            </div>

            <div className='col-12'>
              <Input type='text' name='guests' label={t('form.guests')} />
            </div>

            <div className='col-12'>
              <Input
                type='textarea'
                name='additional_information'
                rows={5}
                label={t('form.additional_information')}
              />
            </div>

            <div className='col-12'>
              <button
                type='submit'
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

export default ContactForm
