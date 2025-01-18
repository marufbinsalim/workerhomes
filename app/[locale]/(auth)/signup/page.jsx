import dynamic from 'next/dynamic'
import CallToActions from '@/components/common/CallToActions'
import DefaultHeader from '@/components/header/default-header'
import DefaultFooter from '@/components/footer/default'
import LoginWithSocial from '@/components/common/LoginWithSocial'
import SignUpForm from '@/components/form/auth/signup'
import Wrapper from '@/components/layout/Wrapper'
import { getTranslations } from 'next-intl/server'
import ReCaptchaProvider from '@/context/ReCaptchaProvider'

export const metadata = {
  title: 'Sign Up || Workerhomes',
  description: 'Sign up to Workerhomes to get access to all the features',
}

const SignUp = async () => {
  const t = await getTranslations('register')
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
                  <SignUpForm />
                </ReCaptchaProvider>
                {/* End SignUP */}

                {/* <div className='row y-gap-20 pt-30'>
                  <div className='col-12'>
                    <div className='text-center'>{t('social.title')}</div>
                  </div>
                  <LoginWithSocial />
                  <div className='col-12'>
                    <div className='text-center px-30'>
                      {t('social.description')}
                    </div>
                  </div>
                </div> */}
                {/* End .row */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End login section */}

      {/* <CallToActions /> */}
      {/* End Call To Actions Section */}
    </Wrapper>
  )
}

export default dynamic(() => Promise.resolve(SignUp), { ssr: false })
