import Wrapper from '@/components/layout/Wrapper'
import ListingPage from '@/components/pages/website/listings'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'listings' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(({ params }) => (
      <Wrapper disableFooter>
        <ListingPage locale={params?.locale} />
      </Wrapper>
    )),
  {
    ssr: false,
  }
)
