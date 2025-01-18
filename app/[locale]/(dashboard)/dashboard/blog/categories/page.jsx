import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

const DwellingCategoryPage = dynamic(
  () => import('@/components/pages/blog/category'),
  { ssr: false }
)

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'blog-categories' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => (
      <DwellingCategoryPage locale={locale} />
    )),
  {
    ssr: false,
  }
)
