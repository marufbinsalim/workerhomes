import Link from '@/components/common/Link'
import { useTranslations } from 'next-intl'

const SignUpForm = () => {
  const t = useTranslations('register')
  return (
    <form className='row y-gap-20'>
      <div className='col-12'>
        <h1 className='text-22 fw-500'>{t('title')}</h1>
        <p className='mt-10'>
          {t('message.text')}{' '}
          <Link href='/login' className='text-blue-1'>
            {t('message.link')}
          </Link>
        </p>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <div className='form-input '>
          <input type='text' required />
          <label className='lh-1 text-14 text-light-1'>
            {t('form.firstname')}
          </label>
        </div>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <div className='form-input '>
          <input type='text' required />
          <label className='lh-1 text-14 text-light-1'>
            {t('form.lastname')}
          </label>
        </div>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <div className='form-input '>
          <input type='text' required />
          <label className='lh-1 text-14 text-light-1'>{t('form.email')}</label>
        </div>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <div className='form-input '>
          <input type='password' required />
          <label className='lh-1 text-14 text-light-1'>
            {t('form.password')}
          </label>
        </div>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <div className='form-input '>
          <input type='password' required />
          <label className='lh-1 text-14 text-light-1'>
            {t('form.confirm')}
          </label>
        </div>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <div className='d-flex '>
          <div className='form-checkbox mt-5'>
            <input type='checkbox' name='name' />
            <div className='form-checkbox__mark'>
              <div className='form-checkbox__icon icon-check' />
            </div>
          </div>
          <div className='text-15 lh-15 text-light-1 ml-10'>
            {t('form.privacy')}
          </div>
        </div>
      </div>
      {/* End .col */}

      <div className='col-12'>
        <button
          type='submit'
          href='#'
          className='button py-20 -dark-1 bg-blue-1 text-white w-100'
        >
          {t('form.button')} <div className='icon-arrow-top-right ml-15' />
        </button>
      </div>
      {/* End .col */}
    </form>
  )
}

export default SignUpForm
