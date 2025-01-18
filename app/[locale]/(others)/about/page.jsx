import Block1 from '@/components/about/Block1'
import WhyChoose from '@/components/block/BlockGuide'
import BlockGuide2 from '@/components/block/BlokGuide2'
import Brand from '@/components/brand/Brand'
import Link from '@/components/common/Link'
import Counter from '@/components/counter/Counter'
import WhyChooseUs from '@/components/home/home-3/WhyChoose'
import Wrapper from '@/components/layout/Wrapper'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'
import Image from 'next/image'

export const metadata = {
  title: 'About || Workerhomes',
  description: 'Here You can find your dream.',
}

const About = async () => {
  const t = await getTranslations('about')

  return (
    <Wrapper>
      <div className='header-margin'></div>

      <section className='section-bg layout-pt-lg layout-pb-lg'>
        <div className='section-bg__item col-12'>
          <Image
            width={1920}
            height={400}
            src='/img/pages/about/1.png'
            alt='image'
            priority
          />
        </div>
        {/* End section-bg__item */}

        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-xl-6 col-lg-8 col-md-10'>
              <h1 className='text-40 md:text-25 fw-600 text-white'>
                {t('title.main')}
              </h1>
              {/* <div className='text-white mt-15'>
                Your trusted trip companion
              </div> */}
            </div>
          </div>
        </div>
        {/* End .container */}
      </section>
      {/* End About Banner Section */}

      <section className='layout-pt-lg layout-pb-md'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-auto'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>{t('title.who')}</h2>
                <p className=' sectionTitle__text mt-5 sm:mt-0'>
                  {t('description.who')}
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className='row y-gap-40 justify-between pt-50'>
            <BlockGuide2 t={t} />
          </div>
        </div>
        {/* End .container */}
      </section>
      {/* End Why Choose Us section */}

      <section className='layout-pt-md'>
        <div className='container'>
          <div className='row y-gap-30 justify-between items-center'>
            <Block1 t={t} />
          </div>
        </div>
      </section>

      <section className='layout-pt-lg layout-pb-md'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-auto'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>{t('title.vision')}</h2>
                <p className=' sectionTitle__text mt-5 sm:mt-0'>
                  {t('description.vision')}
                </p>
              </div>
            </div>
          </div>

          <div className='row y-gap-40 justify-between pt-50'>
            <WhyChoose t={t} />
          </div>
        </div>
      </section>

      <section className='section-bg layout-pt-lg layout-pb-lg'>
        <div className='section-bg__item -mx-20 bg-light-2' />
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-auto'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>{t('title.community')}</h2>
                <p className=' sectionTitle__text mt-5 sm:mt-0'>
                  {t('description.community')}
                </p>

                <div className='row y-gap-30 justify-center pt-50'>
                  <Link
                    href={'/pricing'}
                    className='col-auto button -sm bg-blue-1 text-white'
                  >
                    {t('title.connect')}
                  </Link>
                  <p className=' sectionTitle__text mt-5 sm:mt-0'>
                    {t('description.connect')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End .container */}
      </section>

      <section className='layout-pt-lg layout-pb-md'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-auto'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>{t('title.offer')}</h2>
              </div>
            </div>
          </div>

          <div className='row y-gap-40 justify-between pt-50'>
            <WhyChooseUs />
          </div>
        </div>
      </section>
      {/* End testimonial section */}
    </Wrapper>
  )
}

export default dynamic(() => Promise.resolve(About), { ssr: false })
