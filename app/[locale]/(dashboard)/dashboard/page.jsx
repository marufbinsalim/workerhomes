import DashboardPage from '@/components/pages/dashboard'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' })

  return {
    title: t('title'),
  }
}

export default dynamic(() => Promise.resolve(() => <DashboardPage />), {
  ssr: false,
})
