import CustomerNotification from '@/components/common/customerNotification'
import { getCurrentUser } from '@/lib/session'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function RootLayout({ children, params: { locale } }) {
  const messages = await getMessages()
  const user = await getCurrentUser()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
