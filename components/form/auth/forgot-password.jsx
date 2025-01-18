'use client'

import { api } from '@/config'
import { forgotPassword } from '@/lib/services/auth'
import { authSchema } from '@/lib/validation/auth'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { useFormik } from 'formik'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { toast } from 'react-toastify'

const ForgotPasswordForm = ({ locale }) => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const t = useTranslations('forgot-password')
  const searchParams = useSearchParams()
  const callbackUrl = `/${locale}`

  const handleVerifyAccount = async email => {
    try {
      const result = await axios.post(api + '/api/auth/local/verify-account', {
        data: {
          email,
        },
      })

      if (result?.status == 200) {
        if (result?.data?.provider !== 'local') {
          toast.error(t('messages.provider-error'))
          return false
        } else {
          return true
        }
      }

      return false
    } catch (error) {
      console.log(error)
      toast.error(t('messages.failed'))

      return false
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: authSchema.forgotPassword,
    enableReinitialize: true,
    onSubmit: async values => {
      setIsLoading(true)

      if (!executeRecaptcha) {
        setIsLoading(false)
        return toast.error(t('messages.recaptcha-not-ready'))
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

        const isVerified = await handleVerifyAccount(values?.email)

        if (!isVerified) {
          setIsLoading(false)
          return false
        }

        const result = await forgotPassword(values.email)
        // console.log(result.status)
        // if (
        //   result.status !== 200 ||
        //   result.status !== 201 ||
        //   result.status !== 204
        // ) {
        //   setIsLoading(false)
        //   return toast.error(t('messages.failed'))
        // }

        toast.success(t('messages.success'))
        return router.push(`/${locale}`)
      } catch (error) {
        setIsLoading(false)
        console.log(error)
        toast.error(t('messages.error'))
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <form
      className='row y-gap-20'
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
    >
      <div className='col-12'>
        <div className='form-input '>
          <input
            type='email'
            name='email'
            autoFocus
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            disabled={isLoading}
            required
          />
          <label className='lh-1 text-14 text-light-1'>{t('form.email')}</label>
        </div>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <button
          type='submit'
          disabled={isLoading || !formik.isValid}
          className='button py-20  -dark-1 bg-blue-1 text-white w-100'
        >
          {t('send')}{' '}
          <Icon
            icon={isLoading ? 'line-md:loading-loop' : 'mdi:email-send-outline'}
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

export default ForgotPasswordForm

// 'use client'

// import { api } from '@/config'
// import { useState } from 'react'
// import { forgotPassword } from '@/lib/services/auth'

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')

//   return (
//     <div>
//       <h1>Forgot Password</h1>
//       <form onSubmit={handleForgotPassword}>
//         <input
//           type='email'
//           placeholder='Enter your email'
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//         />
//         <button type='submit'>Send Reset Link</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   )
// }
