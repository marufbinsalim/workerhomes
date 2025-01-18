'use client'

import ControlPanel from '@/components/common/controlPanel'
import Table from '@/components/common/table'
import useFetch from '@/hooks/useFetch'
import { exactPath, formatDate } from '@/utils'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'

export default function StatisticsPage() {
  const locale = useParams().locale
  const t = useTranslations('statistics')

  const { data: session } = useSession()

  const { data, isLoading } = useFetch({
    keys: ['statistics', session?.id],
    url: `/api/auth/local/statistics/${session?.id}`,
  })

  console.log(data)

  const dwellingColumns = [
    {
      Header: t('table.image'),
      Cell: item => {
        const url = item?.images?.[0]?.image?.url
          ? item?.images?.[0]?.image?.url
          : '/uploads/demo_cbcb7e3dc1.png'
        return (
          <span
            style={{
              width: '50px',
              height: '50px',
              display: 'block',
              position: 'relative',
            }}
          >
            <Image
              src={exactPath(url)}
              alt={item?.title}
              fill
              style={{ objectFit: 'cover' }}
              className='border rounded-4'
            />
          </span>
        )
      },
    },
    {
      Header: t('table.title'),
      Cell: item => <span>{item?.title ? item?.title : 'N/A'}</span>,
    },
    {
      Header: t('table.count'),
      Cell: item => (
        <span>
          {item?.count ? item?.count : 0} {t('views')}
        </span>
      ),
    },
    {
      Header: t('table.date'),
      Cell: item => (
        <span>
          {item?.date ? formatDate(item?.date, false, locale) : 'N/A'}
        </span>
      ),
    },
  ]

  return (
    <>
      <ControlPanel
        title={t('title')}
        // description={t('description')}
        // breadcrumbs={['']}
        isSearchable={false}
      />

      <div className='py-30 px-30 rounded-4 bg-white shadow-3'>
        <div className='row y-gap-30 pt-20'>
          <div className='py-30 px-30 rounded-4 '>
            <div className='d-flex justify-between items-center'>
              <div className='row x-gap-30 y-gap-30 w-100'>
                <div className='col-md-6 col-sm-12 d-flex flex-column bg-white shadow-3'>
                  <div className='d-flex flex-column items-center gap-4 justify-start'>
                    <h3 className='text-18'> {t('views')}</h3>
                    <h1>{data?.dwelling?.count || 0}</h1>
                  </div>
                </div>

                <div className='col-md-6 col-sm-12 d-flex flex-column items-center gap-4 justify-start bg-white shadow-3'>
                  <h3 className='text-18'> {t('contacts')}</h3>

                  <h1>{data?.contacts?.count || 0}</h1>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className='mb-30'>{t('most-visited')}</h4>
            <Table
              fullHeight={false}
              data={
                data?.dwelling?.data?.length > 0
                  ? data?.dwelling?.data?.filter(i => i.count > 0)
                  : []
              }
              columns={dwellingColumns}
            />
          </div>
        </div>
      </div>
    </>
  )
}
