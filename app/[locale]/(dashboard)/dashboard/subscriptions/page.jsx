import SubscriptionPage from '@/components/pages/subscription'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'subscription' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => (
      <SubscriptionPage locale={locale} />
    )),
  {
    ssr: false,
  }
)
