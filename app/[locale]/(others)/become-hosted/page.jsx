import Wrapper from '@/components/layout/Wrapper'
import BecomeHostedPage from '@/components/pages/website/become-hosted/page'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'become-hosted' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(() => (
      <Wrapper>
        <BecomeHostedPage />
      </Wrapper>
    )),
  {
    ssr: false,
  }
)
