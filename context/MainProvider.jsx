'use client'

import ScrollTop from '@/components/common/ScrollTop'
import Aos from 'aos'
import { useEffect } from 'react'
import NextTopLoader from 'nextjs-toploader'

import '@/styles/index.scss'
import 'aos/dist/aos.css'
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
import { Provider } from 'react-redux'

const fontNova = localFont({
  src: '../assets/fonts/ProximaNovaFont.otf',
  display: 'swap',
})

const MainProvider = ({ children, locale }) => {
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
        {/* <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='true'
        /> */}
        {/* <link
          href='https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap'
          rel='stylesheet'
        /> */}
        <link rel='icon' href='./favicon.ico' />
      </head>
      <body className={fontNova.className}>
        <main>
          <NextTopLoader color='#ff7504' />
          <Provider store={store}>
            {children}
            <ScrollTop />
          </Provider>
        </main>
      </body>
    </html>
  )
}

export default MainProvider
