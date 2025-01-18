'use client'

import { useTranslations } from 'next-intl'

const SearchBox = ({ search, onChange }) => {
  const t = useTranslations('blog')
  function handleSubmit(e) {
    e.preventDefault()
  }
  return (
    <dev className='single-field relative d-flex items-center py-10'>
      <input
        className='pl-50 border-light text-dark-1 h-50 rounded-8'
        type='search'
        value={search}
        onChange={e => onChange(e.target.value)}
        placeholder={t('sidebar.search.title')}
      />
      <button className='absolute d-flex items-center h-full'>
        <i className='icon-search text-20 px-15 text-dark-1' />
      </button>
    </dev>
  )
}

export default SearchBox
