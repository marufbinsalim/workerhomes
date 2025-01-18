import { useTranslations } from 'next-intl'
import Social from '../../../components/common/social/Social'

const Copyright = () => {
  const t = useTranslations('footer')
  return (
    <div className='row justify-between items-center y-gap-10'>
      <div className='col-auto'>
        <div className='row x-gap-30 y-gap-10'>
          <div className='col-auto'>
            <div className='d-flex items-center'>
              © {new Date().getFullYear()} {t('copy.right.by')}
              <a
                href='https://themeforest.net/user/ib-themes'
                className='mx-2'
                target='_blank'
                rel='noopener noreferrer'
              >
                {t('copy.right.brand')}
              </a>
              {t('copy.right.text')}
            </div>
          </div>
          {/* End .col */}
        </div>
        {/* End .row */}
      </div>
      {/* End .col */}

      <div className='col-auto'>
        <div className='d-flex x-gap-15'>
          <a href='#'>{t('copy.privacy')}</a>
          <a href='#'>{t('copy.terms')}</a>
          <a href='#'>{t('copy.sitemap')}</a>
        </div>
      </div>
      {/* <div className='col-auto'>
        <div className='row y-gap-10 items-center'>
          <div className='col-auto'>
            <div className='d-flex items-center'>
              <button className='d-flex items-center text-14 fw-500 text-dark-1 mr-10'>
                <i className='icon-globe text-16 mr-10' />
                <span className='underline'>English (US)</span>
              </button>
              <button className='d-flex items-center text-14 fw-500 text-dark-1'>
                <i className='icon-usd text-16 mr-10' />
                <span className='underline'>USD</span>
              </button>
            </div>
          </div>
        </div>
      </div> */}
      {/* End .col */}
    </div>
  )
}

export default Copyright
