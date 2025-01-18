import { exactPath } from '@/utils'
import Image from 'next/image'

const Block1 = ({ t }) => {
  return (
    <>
      <div className='col-lg-5'>
        <h2 className='text-30 fw-600'>
          {t('title.welcome')}{' '}
          <span className='text-brand'>{t('title.brand')}</span>
        </h2>
        <p className='mt-5'>{t('description.main')}</p>
      </div>
      {/* End .col */}

      <div className='col-lg-6'>
        <Image
          width={400}
          height={400}
          src={exactPath('/uploads/for_rent_f35cfe5bc0.png')}
          alt='image'
          className='rounded-4 w-100'
        />
      </div>
      {/* End .col */}
    </>
  )
}

export default Block1
