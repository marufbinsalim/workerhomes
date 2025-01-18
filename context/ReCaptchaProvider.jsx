'use client'

import { reCaptcha } from '@/config'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const ReCaptchaProvider = ({ children }) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptcha.siteKey}>
      {children}
    </GoogleReCaptchaProvider>
  )
}

export default ReCaptchaProvider
