import DwellingEditPage from '@/components/pages/dwelling/edit'
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
    Promise.resolve(({ params: { locale, id } }) => (
      <DwellingEditPage locale={locale} id={id} />
    )),
  {
    ssr: false,
  }
)
