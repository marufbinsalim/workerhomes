import { useTranslations } from 'next-intl'
import { FaDollarSign } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";


const PackageSelectCard = ({ item, className, value, onChange }) => {
  const t = useTranslations('plan')

  let title = ''

  switch (item?.name) {
    case 'Free':
      title = t('options.free')
      break
    case 'Silver':
      title = t('options.silver')
      break
    case 'Gold':
      title = t('options.gold')
      break
    case 'Platinum':
      title = t('options.platinum')
      break
    default:
      title = item?.name
  }

  const isPlatinum = item?.name === 'Platinum'

  return (
    <div className={`tw:relative font-primary tw:flex tw:flex-col tw:md:w-[288px] ${isPlatinum ? 'tw:md:mt-[-46px] tw:h-[591px]' : 'tw:h-[545px]'
      } tw:p-6 ${isPlatinum
      ? 'tw:border-[var(--color-primary)] tw:shadow-[0px_0px_26px_0px_rgba(253,105,0,0.13)] '
      : 'tw:border-[var(--color-primary)] tw:shadow-[0px_0px_15px_0px_rgba(0,0,0,0.06)]'
      } tw:border tw:border-solid tw:rounded-lg tw:bg-white ${className}`}>

      {/* Recommended badge - made more orange */}
      {isPlatinum && (
        <div className="tw:bg-gradient-to-r tw:from-orange-500 tw:to-orange-600 tw:text-white tw:font-semibold tw:text-[14px] tw:leading-[1] tw:tracking-[.2em] tw:cursor-pointer tw:rounded tw:w-full tw:h-[34px] tw:mb-3 tw:flex tw:items-center tw:justify-center">
          {t('features.recommended')}
        </div>
      )}


      {/* Plan title - left aligned */}
      <h3 className='tw:text-[24px] tw:font-semibold tw:text-[var(--color-primary)] tw:text-left tw:mb-4'>{title}</h3>

      <div className='tw:flex tw:items-baseline tw:mb-4'>
        <span className='tw:font-semibold tw:text-[24px] tw:text-[var(--color-font-dark)] tw:relative tw:top-[0.15em]'>
          <FaDollarSign />
        </span>
        <span className='tw:font-semibold tw:text-[40px] tw:leading-none  tw:text-[var(--color-font-dark)] tw:ml-[-2px]'>
          {item?.price}
        </span>
        <span className='tw:font-semibold tw:text-[14px] tw:leading-none tw:text-[var(--color-font-regular)] tw:ml-1'>
          {t('features.month')}
        </span>
      </div>


      {/* Choose plan button */}
      <button
        className="
            tw:w-full md:w-[240px]
            tw:h-[38px]
            tw:flex 
            tw:items-center 
            tw:justify-center 
            tw:gap-[10px] 
            tw:py-[10px] 
            tw:px-[25px] 
            tw:border-2 
            tw:border-[var(--color-brand-secondary)]
            tw:font-semibold 
            tw:mb-4 
            tw:text-[14px]
            tw:transition-colors 
            tw:bg-white 
            tw:text-[var(--color-brand-secondary)]
            tw:hover:bg-[var(--color-brand-secondary)]
            tw:hover:text-white"
        onClick={() => onChange(item)}
      >
        {t('features.button.choose')}
      </button>


      {/* Features list with checkmarks */}
      <div className='tw:flex-1'>
        <h4 className='tw:font-semibold tw:text-[16px] tw:mb-3 tw:text-left tw:text-[var(--color-font-dark)]'>{t('coreFeature')}</h4>
        <ul className='tw:space-y-3 tw:text-sm'>
          {/* Pictures */}
          <li className='tw:flex tw:items-start tw:gap-2'>
            <FaCheck className='tw:text-green-500 tw:w-4 tw:h-4 tw:mt-0.5'/>
          
            <span className='tw:font-medium tw:text-[14px] tw:text-[#5C5D76]'>{item?.pics} {t('features.list.picture')}</span>
          </li>

          {/* Website link */}
          {item?.roles?.website && (
            <li className='tw:flex tw:items-start tw:gap-2'>
              <FaCheck className='tw:text-green-500 tw:w-4 tw:h-4 tw:mt-0.5' />
              <span className='tw:font-medium tw:text-[14px] tw:text-[#5C5D76]'>{t('features.list.website')}</span>
            </li>
          )}

          {/* Social links */}
          {item?.roles?.facebook && (
            <li className='tw:flex tw:items-start tw:gap-2'>
              <FaCheck className='tw:text-green-500 tw:w-4 tw:h-4 tw:mt-0.5' />
              <span className='tw:font-medium tw:text-[14px] tw:text-[#5C5D76]'>{t('features.list.facebook')}</span>
            </li>
          )}
          {item?.roles?.instagram && (
            <li className='tw:flex tw:items-start tw:gap-2'>
              <FaCheck className='tw:text-green-500 tw:w-4 tw:h-4 tw:mt-0.5' />
              <span className='tw:font-medium tw:text-[14px] tw:text-[#5C5D76]'> {t('features.list.instagram')}</span>
            </li>
          )}

          {/* Google listing */}
          {item?.roles?.google_listing && (
            <li className='tw:flex tw:items-start tw:gap-2'>
              <FaCheck className='tw:text-green-500 tw:w-4 tw:h-4 tw:mt-0.5' />
              <span className='tw:font-medium tw:text-[14px] tw:text-[#5C5D76]'> {t('features.list.google')}</span>
            </li>
          )}

          {/* Featured section */}
          {item?.roles?.featured && (
            <li className='tw:flex tw:items-start tw:gap-2'>
              <FaCheck className='tw:text-green-500 tw:w-4 tw:h-4 tw:mt-0.5' />
              <span className='tw:font-medium tw:text-[14px] tw:text-[#5C5D76]'>{t('features.list.featured')}</span>
            </li>
          )}

          {/* Search position */}
          {item?.roles?.search_position && (
            <li className='tw:flex tw:flex-col tw:gap-1'>
              <div className='tw:flex tw:items-start tw:gap-2'>
                <FaCheck className='tw:text-green-500 tw:w-4 tw:h-4 tw:mt-0.5' />
                <span className='tw:font-medium tw:text-[14px] tw:text-[#5C5D76]'> {t('features.list.search')} </span>
              </div>
              <div className='tw:flex tw:items-start  tw:pl-5 tw:text-gray-600'>
                <div className="tw:relative tw:w-6 tw:h-6 tw:-mt-1">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="tw:absolute tw:top-0 tw:left-0 tw:text-gray-400"
                  >
                    <path
                      d="M6 0 Q6 12, 18 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="6" cy="0" r="1" fill="currentColor" />
                    <circle cx="18" cy="12" r="1" fill="currentColor" />
                  </svg>
                </div>
                <span className='tw:font-semibold tw:text-[12px] tw:text-[var(--color-primary)]'>
                  {item?.roles?.search_position === '10' &&
                    t('features.position.first')}
                  {item?.roles?.search_position === '20' &&
                    t('features.position.second')}
                  {item?.roles?.search_position === '30' &&
                    t('features.position.third')}
                  {item?.roles?.search_position === '40' &&
                    t('features.position.last')}
                </span>
              </div>
            </li>
          )}
          
          {/* Coverage radius */}
          <li className='tw:flex tw:items-start tw:gap-2'>
            <FaCheck className='tw:text-green-500 tw:w-4 tw:h-4 tw:mt-0.5' />
            <span className='tw:font-medium tw:text-[14px] tw:text-[#5C5D76]'>
              <span className="tw:text-[var(--color-primary)] tw:font-semibold">
                {item?.roles?.visibility_radius}Km
              </span>{' '}
              {t('features.list.visibility')}
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PackageSelectCard