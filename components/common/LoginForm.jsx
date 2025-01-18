'use client'

import Link from '@/components/common/Link'
import { authSchema } from '@/lib/validation/auth'
import { Form, useFormik } from 'formik'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'
import { signOut, useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'

const LoginForm = ({ locale }) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('login')
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: authSchema.signIn,
    enableReinitialize: true,
    onSubmit: async values => {
      setIsLoading(true)

      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      setIsLoading(false)

      if (!result.ok) {
        return toast.error('Invalid credentials. Please try again.')
      }

      toast.success("You're logged in successfully")
      router.replace(`/${locale}/dashboard`)
      return
    },
  })

  return (
    <form
      className='row y-gap-20'
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
    >
      <div className='col-12'>
        <h1 className='text-22 fw-500'>Welcome back</h1>
        <p className='mt-10'>
          {t('message.text')}{' '}
          <Link href='/signup' className='text-blue-1'>
            {t('message.link')}
          </Link>
        </p>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <div className='form-input '>
          <input
            type='email'
            name='email'
            autoFocus
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <label className='lh-1 text-14 text-light-1'>{t('form.email')}</label>
        </div>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <div className='form-input '>
          <input
            type='password'
            name='password'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <label className='lh-1 text-14 text-light-1'>
            {t('form.password')}
          </label>
        </div>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <a href='#' className='text-14 fw-500 text-blue-1 underline'>
          {t('form.forgot')}
        </a>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <button
          type='submit'
          className='button py-20  -dark-1 bg-blue-1 text-white w-100'
        >
          {t('form.button')}{' '}
          <Icon
            icon={
              isLoading ? 'line-md:loading-loop' : 'solar:login-3-line-duotone'
            }
            className='ml-10'
            width={20}
            height={20}
          />
        </button>
      </div>
      {/* End .col */}
    </form>
  )
}

export default LoginForm
