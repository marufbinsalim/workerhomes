import StatisticsPage from '@/components/pages/statistics'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'statistics' })

  return {
    title: t('title'),
  }
}

export default dynamic(() => Promise.resolve(() => <StatisticsPage />), {
  ssr: false,
})
