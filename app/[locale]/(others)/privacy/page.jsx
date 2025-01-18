import dynamic from 'next/dynamic'
import CallToActions from '@/components/common/CallToActions'
import DefaultHeader from '@/components/header/default-header'
import DefaultFooter from '@/components/footer/default'
import PrivacyContent from '@/components/common/PrivacyContent' // New Component for Privacy Policy Content
import Wrapper from '@/components/layout/Wrapper'

export const metadata = {
  title: 'Privacy Policy || WorkerHomes.pl',
  description: 'Privacy Policy for WorkerHomes.pl',
}

const Privacy = () => {
  return (
    <Wrapper>
      <div className='header-margin'></div>
      <section className='layout-pt-lg layout-pb-lg'>
        <div className='container'>
          <div className='tabs js-tabs'>
            <PrivacyContent /> {/* Insert your privacy content here */}
          </div>
        </div>
      </section>
    </Wrapper>
  )
}

export default dynamic(() => Promise.resolve(Privacy), { ssr: false })
