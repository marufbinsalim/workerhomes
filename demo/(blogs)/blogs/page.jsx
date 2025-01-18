import BlogSidebar from '@/components/blog/blog-sidebar'
import Blog2 from '@/components/blog/Blog2'
import BlogPagination from '@/components/blog/BlogPagination'
import CallToActions from '@/components/common/CallToActions'
import LocationTopBar from '@/components/common/LocationTopBar'
import Wrapper from '@/components/layout/Wrapper'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

export const metadata = {
  title: 'Blog List V2 || GoTrip - Travel & Tour React NextJS Template',
  description: 'GoTrip - Travel & Tour React NextJS Template',
}

const BlogListV2 = async () => {
  const t = await getTranslations('blog')
  return (
    <Wrapper>
      <div className='header-margin'></div>

      <LocationTopBar />
      {/* End location top bar section */}

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
                <Blog2 />
              </div>
              {/* End .row */}
              <BlogPagination />
            </div>
            {/* End .col */}

            <div className='col-xl-3'>
              <BlogSidebar />
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>

      <CallToActions />
      {/* End Call To Actions Section */}
    </Wrapper>
  )
}

export default dynamic(() => Promise.resolve(BlogListV2), {
  ssr: false,
})
