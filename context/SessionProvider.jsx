'use client'

import { SessionProvider } from 'next-auth/react'
import AuthProvider from './AuthProvider'

function AuthSessionProvider({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default AuthSessionProvider
