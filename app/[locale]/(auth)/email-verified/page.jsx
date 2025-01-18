import Link from '@/components/common/Link'
import Wrapper from '@/components/layout/Wrapper'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export const metadata = {
  title: `Forgot Password || HomesWorkers - Find your best place with lower charges.`,
  description: `HomesWorkers - Find your best place with lower charges.`,
}

const EmailVerifiedPage = async ({ params }) => {
  const t = await getTranslations('email-verified')

  return (
    <Wrapper>
      {/* End Page Title */}

      <div className='header-margin'></div>
      {/* header top margin */}

      <section className='layout-pt-lg layout-pb-lg bg-blue-2'>
        <div className='container'>
          <div className='row justify-center'>
            <div className='col-xl-6 col-lg-7 col-md-9'>
              <div className='px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4 text-center'>
                <h1>{t('title')}</h1>
                <p className='my-30'>{t('description')}</p>

                <Link
                  href='/login'
                  className='button py-20  -dark-1 bg-blue-1 text-white w-100 mt-30'
                >
                  {t('button')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  )
}

export default dynamic(() => Promise.resolve(EmailVerifiedPage), {
  ssr: false,
})
