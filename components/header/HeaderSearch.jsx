import { useTranslations } from 'next-intl'

const HeaderSearch = ({ value, onChange, className, ...rest }) => {
  const t = useTranslations('hero')
  return (
    <div className='relative d-flex items-center'>
      <input
        className={`input  bg-white border-light rounded-100 px-50 py-20 text-14 lh-12 ${className}`}
        type='text'
        required
        onChange={onChange}
        value={value}
        placeholder={t('search.placeholder')}
        {...rest}
      />
      <button type='submit' className='absolute d-flex items-center h-full'>
        <i className='icon-search text-20 px-15 text-dark-1' />
      </button>
    </div>
  )
}

export default HeaderSearch
