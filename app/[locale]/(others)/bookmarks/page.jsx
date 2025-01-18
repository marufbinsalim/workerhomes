import Wrapper from '@/components/layout/Wrapper'
import BookmarkPage from '@/components/pages/website/bookmarks'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'bookmark' })

  return {
    title: t('title'),
  }
}

export default dynamic(
  () =>
    Promise.resolve(() => (
      <Wrapper defaultFooter>
        <BookmarkPage />
      </Wrapper>
    )),
  {
    ssr: false,
  }
)
