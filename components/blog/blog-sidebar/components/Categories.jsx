import useFetch from '@/hooks/useFetch'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const Categories = ({ t, category, onChange }) => {
  const locale = useParams().locale
  const { data, isLoading } = useFetch({
    url: '/api/blog-categories',
    keys: ['blog-categories'],
    query: {
      locale,
      filters: {
        $and: [
          {
            blogs: {
              $null: false,
            },
          },
          {
            blogs: {
              isApproved: {
                $eq: true,
              },
            },
          },
        ],
      },
      pagination: {
        limit: -1,
      },
      sort: ['title:asc'],
    },
  })
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
      }}
    >
      <button
        onClick={() => onChange(null)}
        className={
          !category?.id
            ? 'd-flex items-center justify-between  bg-blue-1 text-white rounded px-20'
            : 'd-flex items-center justify-between text-dark-1  rounded px-20'
        }
      >
        <span className='text-15 text-dark-1'>{t('sidebar.category.all')}</span>
      </button>
      {data?.length > 0 && !isLoading
        ? data?.map(item => (
            <button
              onClick={() => onChange(item)}
              className={
                category?.id === item?.id
                  ? 'd-flex items-center justify-between  bg-blue-1 text-white rounded px-20'
                  : 'd-flex items-center justify-between text-dark-1  rounded px-20'
              }
              key={item.id}
            >
              <span className='text-15 text-dark-1'>{item.title}</span>
            </button>
          ))
        : null}
    </div>
  )
}

export default Categories
