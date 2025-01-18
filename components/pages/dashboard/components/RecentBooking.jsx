import useFetch from '@/hooks/useFetch'
import { formatDate } from '@/utils'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

const RercentBooking = () => {
  const locale = useParams().locale
  const t = useTranslations('dashboard')
  const tPlan = useTranslations('plan')
  const tStatus = useTranslations('status')
  const { data, isLoading } = useFetch({
    url: '/api/dwellings',
    keys: ['data'],
    query: {
      locale,
      populate: ['subscription.package'],
      pagination: {
        limit: 5,
      },
      sort: ['createdAt:desc'],
    },
  })

  return (
    <div className='overflow-scroll scroll-bar-1 pt-30'>
      {isLoading ? (
        <div>{t('loading.loading')}</div>
      ) : (
        <table className='table-2 col-12'>
          <thead>
            <tr>
              <th>#</th>
              <th>{t('table.item')}</th>
              <th>{t('table.total')}</th>
              <th>{t('table.plan')}</th>
              <th>{t('table.status')}</th>
              <th>{t('table.created')}</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row, index) => {
              const plan = row.subscription?.package?.name?.toLowerCase()
              const status = row.status

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.title}</td>
                  <td className='fw-500'>
                    {row.subscription?.payment_amount
                      ? `zł ${row.subscription?.payment_amount}`
                      : 'zł 0'}
                  </td>
                  <td>{tPlan(`options.${plan}`)}</td>
                  <td>
                    <div
                      className={`rounded-100 py-4 text-center col-12 text-14 fw-500 bg-${row.status.color} text-${row.status.text}`}
                    >
                      {tStatus(status)}
                    </div>
                  </td>
                  <td>{formatDate(row.createdAt, false, locale)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default RercentBooking
