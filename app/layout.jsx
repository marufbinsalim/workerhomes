'use client'

import ScrollTop from '@/components/common/ScrollTop'
import Aos from 'aos'
import NextTopLoader from 'nextjs-toploader'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'

import '@/styles/index.scss'
import '@/styles/main.css'
import 'aos/dist/aos.css'
import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'
import 'swiper/css/effect-cards'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

if (typeof window !== 'undefined') {
  require('bootstrap/dist/js/bootstrap')
}

import localFont from 'next/font/local'

import { store } from '@/store/store'
// import { IntlProvider, useMessages } from 'next-intl'
import { BookmarkProvider } from '@/context/BookmarkProvider'
import { LocationProvider } from '@/context/LocationProvider'
import { SessionProvider, useSession } from 'next-auth/react'
import { Provider } from 'react-redux'

const fontNova = localFont({
  src: '../assets/fonts/ProximaNovaFont.otf',
  display: 'swap',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
})

const MainProvider = ({ children }) => {
  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    })
  }, [])

  return (
    <html>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='true'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap'
          rel='stylesheet'
        />
        <link rel='icon' href='./favicon.ico' />
      </head>
      <body className={fontNova.className}>
        <main>
          <SessionProvider>
            <NextTopLoader color='#ff7504' />
            <ToastContainer
              position='top-center'
              stacked
              hideProgressBar
              newestOnTop
              // style={{
              //   minHeight: '300px',
              // }}
              bodyStyle={{
                minHeight: '100px',
                textAlign: 'center',
              }}
            />
            <Provider store={store}>
              <SupBaseProvider>{children}</SupBaseProvider>
              <ScrollTop />
            </Provider>
          </SessionProvider>
        </main>
      </body>
    </html>
  )
}

export default MainProvider

const SupBaseProvider = ({ children }) => {
  const { data: session, status } = useSession()
  const userId = session?.id // Get the user ID from the session

  return (
    <BookmarkProvider userId={userId}>
      <LocationProvider>{children}</LocationProvider>
    </BookmarkProvider>
  )
}
