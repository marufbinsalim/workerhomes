'use client'

import BlogSidebar from '@/components/blog/blog-sidebar'
import Blog2 from '@/components/blog/Blog2'
import BlogPagination from '@/components/blog/BlogPagination'
import CallToActions from '@/components/common/CallToActions'
import LocationTopBar from '@/components/common/LocationTopBar'
import Wrapper from '@/components/layout/Wrapper'
import { exactPath } from '@/utils'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const BlogPage = ({ locale }) => {
  const t = useTranslations('blog')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(null)
  return (
    <>
      <div className='header-margin'></div>

      <section className='layout-pt-md'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-auto'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>{t('title')}</h2>
                <p className=' sectionTitle__text mt-5 sm:mt-0'>
                  {t('description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End title */}

      <section className='layout-pt-md layout-pb-lg'>
        <div className='container'>
          <div className='row y-gap-30 justify-between'>
            <div className='col-xl-8'>
              <div className='row y-gap-30'>
                <Blog2
                  t={t}
                  locale={locale}
                  search={search}
                  category={category}
                  setSearch={value => setSearch(value)}
                />
              </div>
            </div>
            {/* End .col */}

            <div className='col-xl-3'>
              <BlogSidebar
                t={t}
                search={search}
                setSearch={value => setSearch(value)}
                category={category}
                onCategoryChange={value => setCategory(value)}
              />
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
    </>
  )
}

export default BlogPage
