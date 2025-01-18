'use client'

import Input from '@/components/common/Input'
import { create } from '@/lib/services/contact'
import { contactSchema, initContact } from '@/lib/validation/contact'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useTranslations } from 'next-intl'
import React from 'react'
import { toast } from 'react-toastify'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const ContactForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isLoading, setIsLoading] = React.useState(false)
  const t = useTranslations('contact')
  return (
    <Formik
      initialValues={initContact(null)}
      enableReinitialize={true}
      validationSchema={contactSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)

        if (!executeRecaptcha) {
          setIsLoading(false)
          return toast.error(t('messages.recaptcha-not-ready'))
        }

        try {
          const token = await executeRecaptcha('contact')

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

          await create(values, t('messages.create'))

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
              <Input type='text' name='name' label={t('form.name')} />
            </div>

            <div className='col-12'>
              <Input type='email' name='email' label={t('form.email')} />
            </div>

            <div className='col-12'>
              <Input type='text' name='subject' label={t('form.subject')} />
            </div>

            <div className='col-12'>
              <Input
                type='textarea'
                name='message'
                rows={5}
                label={t('form.message')}
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
