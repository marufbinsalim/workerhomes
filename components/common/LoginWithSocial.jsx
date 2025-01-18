'use client'

import { Icon } from '@iconify/react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

const LoginWithSocial = () => {
  const t = useTranslations('register')
  const locale = useParams().locale
  const callbackUrl = `/${locale}`
  return (
    <>
      <div className='col-md-6 col-12'>
        <button
          className='button col-12 -outline-blue-1 text-blue-1 py-15 rounded-8 '
          onClick={() => signIn('azure-ad', { callbackUrl: callbackUrl })}
        >
          <Icon icon='logos:microsoft-icon' className='mr-10' />
          Microsoft
        </button>
      </div>

      <div className='col-md-6 col-12'>
        <button
          onClick={() => signIn('google', { callbackUrl: callbackUrl })}
          className='button col-12 -outline-blue-1 text-red-1 py-15 rounded-8'
        >
          <Icon icon='devicon:google' className='mr-10' />
          {t('social.google')}
        </button>
      </div>
    </>
  )
}

export default LoginWithSocial
