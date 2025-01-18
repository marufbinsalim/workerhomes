import BlogNavigator from '@/components/blog/blog-details/BlogNavigator'
import Comments from '@/components/blog/blog-details/Comments'
import DetailsContent from '@/components/blog/blog-details/DetailsContent'
import FormReply from '@/components/blog/blog-details/FormReply'
import RelatedBlog from '@/components/blog/blog-details/RelatedBlog'
import TopComment from '@/components/blog/blog-details/TopComment'
import CallToActions from '@/components/common/CallToActions'
import LocationTopBar from '@/components/common/LocationTopBar'
import Wrapper from '@/components/layout/Wrapper'
import { api } from '@/config'
import blogsData from '@/data/blogs'
import { exactPath, formatDate } from '@/utils'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

const fetchBlogBySlug = async (slug, locale) => {
  const res = await fetch(
    api +
      `/api/blogs?filters[slug][$eq]=${slug}&locale=${locale}&populate=image,category.dwellings.image,localizations`,
    {
      next: {
        revalidate: 1,
      },
    }
  )
  const data = await res.json()

  return data?.data?.[0] || null
}

export async function generateMetadata({ params: { locale, slug } }) {
  const seo = await fetchBlogBySlug(slug, locale)

  return {
    title: seo?.title || 'Worker homes Blogs',
    description: seo?.description || 'Worker homes',
    keywords: 'home, apartment, rent',
    openGraph: {
      title: seo?.title || 'Worker homes',
      description: seo?.title || 'Worker homes',
      url: 'https://workerhomes.pl/blogs',
      type: 'website',
      images: [
        {
          url: exactPath(seo?.image?.url),
          width: 800,
          height: 600,
          alt: seo?.metaTitle || 'Default Title',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@workerhomes',
      title: seo?.title || 'Default Title',
      description: 'Workerhomes the best place to find your dream home',
      image: exactPath(seo?.image?.url),
    },
  }
}

const BlogSingleDynamic = async ({ params }) => {
  const blog = await fetchBlogBySlug(params.slug, params.locale)
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'header',
  })

  if (!blog) {
    return {
      notFound: true,
    }
  }

  return (
    <Wrapper>
      <div className='header-margin'></div>
      {/* header top margin */}

      {/* <LocationTopBar /> */}
      {/* End location top bar section */}

      <section className='layout-pt-md layout-pb-md'>
        <div className='container'>
          <div className='row y-gap-40 justify-center text-center'>
            <div className='col-auto'>
              <div className='text-15 fw-500 text-blue-1 mb-8 text-capitalize'>
                {blog?.category?.title || ''}
              </div>
              <h1 className='text-30 fw-600'>{blog?.title}</h1>
              <div className='text-15 text-light-1 mt-10'>
                {blog?.createdAt && formatDate(blog?.createdAt, true)}
              </div>
              {blog?.localizations?.length > 0 && (
                <div className='text-15 text-light-1 mt-10'>
                  {t('locales.title2')}{' '}
                  <span>
                    {blog?.localizations?.map((item, index) => (
                      <Link
                        key={index}
                        href={`/${item.locale}/blogs/${item.slug}`}
                        className='badge'
                      >
                        {t(`locales.${item?.locale}.language`)}
                      </Link>
                    ))}
                  </span>
                </div>
              )}
            </div>
            <div className='col-12'>
              <img
                src={exactPath(blog?.image?.url)}
                alt={blog?.title}
                className='col-12 rounded-8 w-100 img_large_details'
              />
            </div>
          </div>
          {/* End .row top bar image and title */}

          <div className='row y-gap-30 justify-center'>
            <div className='col-xl-8 col-lg-10 layout-pt-md overflow-hidden'>
              {/* <DetailsContent /> */}
              {blog?.description && (
                <div dangerouslySetInnerHTML={{ __html: blog?.description }} />
              )}
              {/* Details content */}

              {/* <div className='border-top-light border-bottom-light py-30 mt-30'>
                <TopComment />
              </div> */}
              {/* End  topcommnet  */}
              {/* <div className='border-bottom-light py-30'>
                <BlogNavigator />
              </div> */}
              {/* End BlogNavigator */}

              {/* <h2 className='text-22 fw-500 mb-15 pt-30'>Guest reviews</h2> */}
              {/* <Comments /> */}
              {/* End comments components */}

              {/* <div className='border-top-light pt-40 mt-40' /> */}

              {/* <div className='row'>
                <div className='col-auto'>
                  <h3 className='text-22 fw-500'>Leave a Reply</h3>
                  <p className='text-15 text-dark-1 mt-5'>
                    Your email address will not be published.
                  </p>
                </div>
              </div> */}
              {/* End Leave a repy title */}

              {/* <FormReply /> */}
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* Details Blog Details Content */}

      {blog?.category?.dwellings?.length > 0 && (
        <section className='layout-pt-md layout-pb-lg'>
          <div className='container'>
            <div className='row justify-center text-center'>
              <div className='col-auto'>
                <div className='sectionTitle -md'>
                  <h2 className='sectionTitle__title'>Related content</h2>
                  <p className=' sectionTitle__text mt-5 sm:mt-0'>
                    Interdum et malesuada fames
                  </p>
                </div>
              </div>
            </div>
            {/* End .row */}

            <div className='row y-gap-30 pt-40'>
              <RelatedBlog data={blog?.category?.dwellings || []} />
            </div>
            {/* End .row */}
          </div>
          {/* End .container */}
        </section>
      )}
      {/* End Related Content */}

      {/* <CallToActions /> */}
      {/* End Call To Actions Section */}
    </Wrapper>
  )
}

export default BlogSingleDynamic
