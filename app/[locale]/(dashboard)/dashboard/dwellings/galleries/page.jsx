import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

const DwellingGalleryPage = dynamic(
  () => import('@/components/pages/dwelling/gallery'),
  { ssr: false }
)

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'dwelling-galleries' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => (
      <DwellingGalleryPage locale={locale} />
    )),
  {
    ssr: false,
  }
)
