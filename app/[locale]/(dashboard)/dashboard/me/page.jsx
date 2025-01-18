import ProfilePage from '@/components/pages/profile'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'profile' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => (
      <ProfilePage locale={locale} />
    )),
  {
    ssr: false,
  }
)
