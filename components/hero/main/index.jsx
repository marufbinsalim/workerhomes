import MainFilterSearchBox from '@/components/common/MainFilterSearchBox'
import HeaderSearch from '@/components/header/HeaderSearch'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const index = ({ locale }) => {
  const t = useTranslations('hero')
  return (
    <section className='masthead -type-3 z-5'>
      <div className='masthead__bg'>
        <Image
          fill
          objectFit='cover'
          alt='image'
          src='/img/masthead/3/bg.png'
          className='js-lazy'
        />
      </div>
      <div className='container'>
        <div className='row justify-center'>
          <div className='col-auto'>
            <div className='text-center'>
              <h1
                className='text-60 lg:text-40 md:text-30 text-white'
                data-aos='fade-up'
              >
                {t('title')}
              </h1>
              <p
                className='text-white mt-10 md:mt-20'
                data-aos='fade-up'
                data-aos-delay='100'
              >
                {t('description')}
              </p>
            </div>
            {/* End hero title */}

            <div
              className='masthead__tabs'
              data-aos='fade-up'
              data-aos-delay='200'
            >
              {/* <HeaderSearch />*/}

              <MainFilterSearchBox locale={locale} />
            </div>
            {/* End tab-filter */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default index
