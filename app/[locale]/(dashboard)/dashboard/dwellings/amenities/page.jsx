import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

const DwellingAmenitiesPage = dynamic(
  () => import('@/components/pages/dwelling/amenity'),
  { ssr: false }
)

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'dwelling-amenities' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => (
      <DwellingAmenitiesPage locale={locale} />
    )),
  {
    ssr: false,
  }
)
