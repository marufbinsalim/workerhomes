import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

const DwellingEquipmentPage = dynamic(
  () => import('@/components/pages/dwelling/equipment'),
  { ssr: false }
)

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'dwelling-equipments' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => (
      <DwellingEquipmentPage locale={locale} />
    )),
  {
    ssr: false,
  }
)
