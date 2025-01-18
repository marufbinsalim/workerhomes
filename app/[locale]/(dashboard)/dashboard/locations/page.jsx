import LocationPage from '@/components/pages/location'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'locations' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => (
      <LocationPage locale={locale} />
    )),
  {
    ssr: false,
  }
)
