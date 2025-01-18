import DwellingCreatePage from '@/components/pages/dwelling/create'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'dwellings' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => (
      <DwellingCreatePage locale={locale} />
    )),
  {
    ssr: false,
  }
)
