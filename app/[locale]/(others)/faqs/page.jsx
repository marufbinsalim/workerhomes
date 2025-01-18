import Faq from '@/components/faq/Faq'
import Wrapper from '@/components/layout/Wrapper'
import React from 'react'

const FAQPage = () => {
  return (
    <Wrapper>
      <div className='header-margin'></div>
      {/* header top margin */}

      <section className='layout-pt-lg layout-pb-lg'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-auto'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>
                  Frequently Asked Questions
                </h2>
                <p className=' sectionTitle__text mt-5 sm:mt-0'>
                  Interdum et malesuada fames
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className='row y-gap-30 justify-center pt-40 sm:pt-20'>
            <div className='col-xl-8 col-lg-10'>
              <div
                className='accordion -simple row y-gap-20 js-accordion'
                id='Faq1'
              >
                <Faq />
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
    </Wrapper>
  )
}

export default FAQPage
