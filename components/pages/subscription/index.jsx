'use client'

import ConfirmModal from '@/components/common/ConfirmModal'
import ControlPanel from '@/components/common/controlPanel'
import DropdownMenu from '@/components/common/DropdownMenu'
import Link from '@/components/common/Link'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import SubscriptionOptions from '@/components/common/SubscriptionOptions'
import Table from '@/components/common/table'
import SubscriptionForm from '@/components/form/subscription'
import { roles, url } from '@/config'
import useFetch from '@/hooks/useFetch'
import { remove } from '@/lib/services/subscription'
import { calculateRemainingTime, formatDate } from '@/utils'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const SubscriptionPage = ({ locale }) => {
  const { data: session } = useSession()
  const t = useTranslations('subscription')
  const tPlan = useTranslations('plan')
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    delete: false,
    translate: false,
  })
  const [filter, setFilter] = useState({
    key: null,
    value: 'All',
  })
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 16

  const { data, error, isLoading, pagination, reFetch } = useFetch({
    keys: ['subscription', search, filter],
    url: '/api/subscriptions',
    query: {
      filters: {
        package: {
          name: {
            $containsi: search || undefined,
          },
        },
        dwellings: {
          id: {
            $null: filter?.key === 'USED' ? true : undefined,
          },
        },
        isExpired: {
          $eq: filter?.key === 'EXPIRED' ? true : undefined,
        },
        stripe_current_period_start: {
          $null:
            filter?.key === 'ADMIN'
              ? true
              : filter?.key === 'PURCHASED'
              ? false
              : undefined,
        },
        user: session?.role !== roles.admin ? session?.id : undefined,
      },
      populate: ['user', 'dwellings', 'package'],
      pagination: {
        page: search ? 1 : currentPage,
        pageSize: pageSize,
      },
      sort: [`end_date:${filter?.key === 'CLOSE_TO_EXPIRE' ? 'asc' : 'desc'}`],
    },
  })

  const handleDelete = async () => {
    setLoading(true)

    try {
      const cancelSubscription = await axios.put(`${url}/api/stripe/cancel`, {
        subscriptionId: selected?.stripe_subscription_id,
      })

      if (cancelSubscription?.status === 200) {
        const res = await remove(selected?.id, t('messages.delete-success'))
        if (res) {
          reFetch()
        }
        setOpen(prev => ({ ...prev, delete: false }))
        setSelected(null)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      Header: t('table.by'),
      Cell: item => {
        const full_name = item?.name
        return (
          <span className='d-grid'>
            {item?.user?.name ? item?.user?.name : item?.user?.email}
            {item?.user?.name && (
              <a
                className='text-primary lowercase'
                href={`mailto:${item?.user?.email}`}
              >
                @{item?.user?.email}
              </a>
            )}
          </span>
        )
      },
    },
    {
      Header: t('table.package'),
      Cell: item => (
        <span>{tPlan(`options.${item?.package?.name?.toLowerCase()}`)}</span>
      ),
    },
    {
      Header: t('table.start'),
      Cell: item => (
        <span>
          {item?.start_date
            ? formatDate(item?.start_date, false, locale)
            : 'N/A'}
        </span>
      ),
    },
    {
      Header: t('table.end'),
      Cell: item => (
        <span>
          {item?.end_date
            ? formatDate(item?.end_date, false, locale)
            : 'Unlimited'}
          <br />
          {item?.end_date && (
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '5px',
                color: 'orange',
                fontSize: '0.7rem',
              }}
            >
              <Icon icon='pepicons-pop:reload' />
              {item?.end_date ? calculateRemainingTime(item?.end_date) : 'N/A'}
            </span>
          )}
        </span>
      ),
    },

    {
      Header: t('table.status'),
      Cell: item => (
        <span
          className={`rounded-100 py-4 text-center col-12 text-14 fw-500 bg-${
            item?.isExpired ? 'red-3' : 'blue-1-05'
          } text-${item?.isExpired ? 'red-2' : 'blue-1'}`}
        >
          {item?.isExpired ? 'Expired' : 'Active'}
        </span>
      ),
    },
    {
      Header: t('table.amount'),
      Cell: item => (
        <span>
          {item?.payment_amount || 'FREE '}
          {item?.payment_currency && (
            <span className='uppercase'> ({item?.payment_currency})</span>
          )}
        </span>
      ),
    },
    {
      Header: t('table.not-set'),
      Cell: item => {
        return (
          <span>
            {item?.dwellings?.length > 0 ? (
              `YES`
            ) : (
              <span className='badge'>
                Not Yet <Link href={`/dashboard/dwellings`}>Create One</Link>
              </span>
            )}
          </span>
        )
      },
    },
    {
      Header: t('table.options'),
      Cell: item => (
        <DropdownMenu
          options={[
            {
              label: t('control-panel.edit'),
              value: 'edit',
              icon: 'fluent:edit-16-filled',
              disabled:
                item?.stripe_customer_id || item?.stripe_product_id
                  ? true
                  : false,
              onClick: () => {
                setOpen(prev => ({ ...prev, edit: true }))
                setSelected(item)
              },
            },
            {
              label: t('control-panel.delete'),
              value: 'delete',
              icon: 'fluent:delete-16-filled',
              disabled: session?.role !== roles.admin ? true : false,
              onClick: () => {
                setOpen(prev => ({ ...prev, delete: true }))
                setSelected(item)
              },
            },
          ]}
        />
      ),
    },
  ]

  const filterItems = [
    {
      key: null,
      value: t('control-panel.filters.all'),
    },
    {
      key: 'ADMIN',
      value: t('control-panel.filters.admin'),
      disabled: session?.role !== roles.admin ? true : false,
    },
    {
      key: 'PURCHASED',
      value: t('control-panel.filters.purchased'),
    },
    {
      key: 'CLOSE_TO_EXPIRE',
      value: t('control-panel.filters.close-to-expire'),
    },
    {
      key: 'EXPIRED',
      value: t('control-panel.filters.expired'),
    },
    {
      key: 'USED',
      value: t('control-panel.filters.used'),
    },
  ]

  return (
    <>
      <ControlPanel
        title={t('title')}
        description={t('description')}
        actions={[
          {
            label: t('create'),
            onClick: () => setOpen(prev => ({ ...prev, create: true })),
            hidden: session?.role !== roles.admin,
          },
        ]}
        searchPlaceholder={t('control-panel.search')}
        search={search}
        setSearch={setSearch}
        breadcrumbs={[
          t('control-panel.breadcrumb.1'),
          t('control-panel.breadcrumb.2'),
        ]}
        childrenSide='right'
        filterItems={filterItems}
        selectedFilter={filter}
        setSelectedFilter={value => setFilter(value)}
      />

      <div className='py-30 px-30 rounded-4 bg-white shadow-3'>
        <Table isLoading={isLoading} data={data} columns={columns} />

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={pagination?.total ?? 0}
          pageCount={pagination?.pageCount ?? 0}
        />
      </div>

      <Modal
        open={open.create || open.edit || open.translate}
        setOpen={value => {
          setOpen(prev => ({
            ...prev,
            create: value,
            edit: value,
            translate: value,
          }))
          setSelected(null)
        }}
        title={
          selected?.id && !open.translate
            ? t('form.titles.edit')
            : selected?.id && open.translate
            ? 'Translate Subscription'
            : t('form.titles.create')
        }
        description={t('form.titles.description')}
      >
        <SubscriptionForm
          formData={selected?.id ? selected : null}
          onSuccess={() => {
            setOpen(false)
            setSelected(null)
            reFetch()
          }}
        />
      </Modal>

      <ConfirmModal
        title='Delete Package'
        message={t('messages.delete')}
        open={open.delete}
        onCancel={value => {
          setOpen(prev => ({ ...prev, delete: value }))
          setSelected(null)
        }}
        onSuccess={handleDelete}
        isLoading={loading}
      />
    </>
  )
}

export default SubscriptionPage
