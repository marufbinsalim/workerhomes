'use client'

import Link from '@/components/common/Link'
import useFetch from '@/hooks/useFetch'
import { exactPath, getFromNowInLocale } from '@/utils'
import moment from 'moment'
import Image from 'next/image'
import { useState } from 'react'
import Pagination from '../common/Pagination'
import SearchBox from '@/components/blog/blog-sidebar/components/SearchBox'

const Blog2 = ({ t, locale = 'en', search, category, setSearch }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState('desc')
  const pageSize = 8

  const { data, isLoading, pagination } = useFetch({
    keys: ['blogs', locale, search, sort],
    url: '/api/blogs',
    query: {
      locale,
      populate: ['image', 'category'],
      sort: [`createdAt:${sort}`],
      pagination: {
        page: search ? 1 : currentPage,
        pageSize: pageSize,
      },
      filters: {
        title: {
          $containsi: search || undefined,
        },
        category: {
          id: {
            $eq: category?.id || undefined,
          },
        },
        isApproved: {
          $eq: true,
        },
      },
    },
  })

  return (
    <div className='row x-gap-0 y-gap-0'>
      <div className=' d-flex justify-content-end align-items-center'>
        <button
          onClick={() => setSort(sort === 'desc' ? 'asc' : 'desc')}
          className='flex-1 button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1'
        >
          <i className='icon-up-down text-14 mr-10' />
          {t('sidebar.recent.sort-by')}{' '}
          {sort === 'desc' ? t('sidebar.recent.new') : t('sidebar.recent.old')}
        </button>
        <div className='d-md-none'>
          <SearchBox search={search} onChange={setSearch} />
        </div>
      </div>
      {data?.length > 0 && !isLoading ? (
        data.map(item => (
          <Link
            href={`/blogs/${item.slug}`}
            className='blogCard -type-1 col-12'
            key={item.id}
          >
            <div className='row y-gap-15 items-center md:justify-center md:text-center'>
              <div className='col-lg-4'>
                <div className='blogCard__image rounded-4'>
                  <Image
                    width={250}
                    height={250}
                    className='cover w-100 img-fluid'
                    src={exactPath(item?.image?.url)}
                    alt='image'
                  />
                </div>
              </div>
              <div className='col-lg-8'>
                <div className='text-15 text-light-1'>
                  {getFromNowInLocale(locale, item?.createdAt)}
                </div>
                <h3 className='text-22 text-dark-1 mt-10 md:mt-5'>
                  {item.title}
                </h3>
                <div className='text-15 lh-16 text-light-1 mt-10 md:mt-5'>
                  <button className='button blue-2 py-5 px-20 bg-blue-1-05 rounded-100 text-15 fw-500 text-blue-1 text-capitalize'>
                    {item?.category?.title}
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : data?.length <= 0 && !isLoading ? (
        <div className='col-12 text-center'>{t('not-found')}</div>
      ) : (
        <div className='col-12 text-center'>{t('loading')}</div>
      )}

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={pagination?.total ?? 0}
        pageCount={pagination?.pageCount ?? 0}
      />
    </div>
  )
}

export default Blog2
