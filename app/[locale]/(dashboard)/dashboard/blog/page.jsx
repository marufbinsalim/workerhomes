import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

const BlogPage = dynamic(() => import('@/components/pages/blog'), {
  ssr: false,
})

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'blogs' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => <BlogPage locale={locale} />),
  {
    ssr: false,
  }
)
