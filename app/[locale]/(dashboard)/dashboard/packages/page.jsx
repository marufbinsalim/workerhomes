import PackageForm from '@/components/pages/package'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'packages' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => (
      <PackageForm locale={locale} />
    )),
  {
    ssr: false,
  }
)
