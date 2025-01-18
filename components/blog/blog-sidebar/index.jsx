import { useTranslations } from 'next-intl'
import Categories from './components/Categories'
import RecentPost from './components/RecentPost'
import SearchBox from './components/SearchBox'
import Tags from './components/Tags'

const index = ({ t, search, setSearch, category, onCategoryChange }) => {
  return (
    <div className='sidebar -blog'>
      <div className='sidebar__item -no-border d-search'>
        <h5 className='text-18 fw-500 mb-10'>{t('sidebar.search.title')}</h5>
        <SearchBox t={t} search={search} onChange={setSearch} />
      </div>
      {/* End searchbox */}

      <div className='sidebar__item'>
        <h5 className='text-18 fw-500 mb-10'>{t('sidebar.category.title')}</h5>
        <div className='y-gap-5'>
          <Categories t={t} category={category} onChange={onCategoryChange} />
        </div>
      </div>
      {/* End .Categories */}

      {/* <div className='sidebar__item'>
        <h5 className='text-18 fw-500 mb-10'>{t('sidebar.recent.title')}</h5>
        <div className='row y-gap-20 pt-10'>
          <RecentPost />
        </div>
      </div> */}
      {/* End RecentPost */}

      {/* <div className='sidebar__item'>
        <h5 className='text-18 fw-500 mb-10'>{t('sidebar.tag.title')}</h5>
        <div className='row x-gap-10 y-gap-10 pt-10'>
          <Tags />
        </div>
      </div> */}
    </div>
  )
}

export default index
