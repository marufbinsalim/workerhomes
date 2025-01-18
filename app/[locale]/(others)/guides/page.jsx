import Wrapper from '@/components/layout/Wrapper'
import GuidePage from '@/components/pages/website/guides'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

export default dynamic(
  () =>
    Promise.resolve(() => (
      <>
        <Wrapper>
          <GuidePage />
        </Wrapper>
      </>
    )),
  {
    ssr: false,
  }
)
