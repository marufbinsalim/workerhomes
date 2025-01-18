import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

const DwellingGuidelinePage = dynamic(
  () => import('@/components/pages/dwelling/guideline'),
  { ssr: false }
)

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'dwelling-guidelines' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => (
      <DwellingGuidelinePage locale={locale} />
    )),
  {
    ssr: false,
  }
)
