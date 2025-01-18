import dynamic from 'next/dynamic'
import CallToActions from '@/components/common/CallToActions'
import DefaultHeader from '@/components/header/default-header'
import DefaultFooter from '@/components/footer/default'
import TermsConent from '@/components/common/TermsConent'
import Wrapper from '@/components/layout/Wrapper'

export const metadata = {
  title: 'Terms & Conditions || WorkerHomes',
  description: 'WorkerHomes Terms & Conditions',
}

const Terms = () => {
  return (
    <Wrapper>
      {/* End Page Title */}

      <div className='header-margin'></div>
      {/* header top margin */}

      <section className='layout-pt-lg layout-pb-lg'>
        <div className='container'>
          <div className='tabs js-tabs'>
            <TermsConent />
          </div>
        </div>
      </section>
      {/* End terms section */}
    </Wrapper>
  )
}

export default dynamic(() => Promise.resolve(Terms), { ssr: false })
