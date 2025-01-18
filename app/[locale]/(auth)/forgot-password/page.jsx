import LoginWithSocial from '@/components/common/LoginWithSocial'
import ForgotPasswordForm from '@/components/form/auth/forgot-password'
import Wrapper from '@/components/layout/Wrapper'
import ReCaptchaProvider from '@/context/ReCaptchaProvider'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export const metadata = {
  title: `Forgot Password || HomesWorkers - Find your best place with lower charges.`,
  description: `HomesWorkers - Find your best place with lower charges.`,
}

const ForgotPasswordPage = async ({ params }) => {
  const t = await getTranslations('forgot-password')

  return (
    <Wrapper>
      {/* End Page Title */}

      <div className='header-margin'></div>
      {/* header top margin */}

      <section className='layout-pt-lg layout-pb-lg bg-blue-2'>
        <div className='container'>
          <div className='row justify-center'>
            <div className='col-xl-6 col-lg-7 col-md-9'>
              <div className='px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4'>
                <ReCaptchaProvider>
                  <ForgotPasswordForm locale={params.locale} />
                </ReCaptchaProvider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  )
}

export default dynamic(() => Promise.resolve(ForgotPasswordPage), {
  ssr: false,
})
