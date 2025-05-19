import { useTranslations } from 'next-intl'

const TopHeaderFilter = ({ total, handAscDesc, handleDistanceAscDesc }) => {
  const t = useTranslations('listings')
  return (
    <>
      <div className='col-auto'>
        <div className='text-18'>
          <span className='fw-500'>
            {total} {t('messages.properties')}
          </span>
        </div>
      </div>
      {/* End .col */}
      <div className='col-auto '>
        <div className='row x-gap-20'>
          <button
            onClick={handAscDesc}
            className='button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1 col-auto'
          >
            <i className='icon-up-down text-14 mr-10' />
            {t('sorts.price')}
          </button>
          <button
            onClick={handleDistanceAscDesc}
            className='button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1 col-auto'
          >
            <i className='icon-up-down text-14 mr-10' />
            {t('sorts.distance')}
          </button>
        </div>
      </div>
      {/* End .col */}
    </>
  )
}

export default TopHeaderFilter
