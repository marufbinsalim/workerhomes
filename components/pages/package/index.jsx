'use client'

import ConfirmModal from '@/components/common/ConfirmModal'
import ControlPanel from '@/components/common/controlPanel'
import DropdownMenu from '@/components/common/DropdownMenu'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import Table from '@/components/common/table'
import PackageForm from '@/components/form/package'
import useFetch from '@/hooks/useFetch'
import { remove } from '@/lib/services/package'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import CheckoutButton from '../../common/CheckoutButton'
import SubscriptionOptions from '@/components/common/SubscriptionOptions'

const PackagePage = ({ locale }) => {
  const t = useTranslations('packages')
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    delete: false,
    translate: false,
  })
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 16

  const { data, error, isLoading, pagination, reFetch } = useFetch({
    keys: ['packages', search],
    url: '/api/packages',
    query: {
      filters: {
        name: {
          $containsi: search || undefined,
        },
      },
      populate: ['icon', 'country', 'localizations'],
      pagination: {
        page: search ? 1 : currentPage,
        pageSize: pageSize,
      },
      sort: ['order:asc'],
    },
  })

  const handleDelete = async () => {
    setLoading(true)
    const res = await remove(selected?.id, t('messages.delete-success'))
    if (res) {
      reFetch()
    }
    setOpen(prev => ({ ...prev, delete: false }))
    setSelected(null)
    setLoading(false)
  }

  const columns = [
    {
      Header: t('table.title'),
      Cell: item => <span>{item?.name || 'N/A'}</span>,
    },
    {
      Header: t('table.price'),
      Cell: item => <span>zł {item?.price || 0}</span>,
    },
    {
      Header: t('table.description'),
      Cell: item => <span>{item?.description || 'N/A'}</span>,
    },
    {
      Header: t('table.recommended'),
      Cell: item => <span>{item?.isRecommend ? 'YES' : 'NO'}</span>,
    },
    {
      Header: t('table.stripe'),
      Cell: item => <span>{item?.stripe_price_id ? 'YES' : 'NO'}</span>,
    },
    {
      Header: 'Order',
      Cell: item => <span>{item?.order}</span>,
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
              onClick: () => {
                setOpen(prev => ({ ...prev, edit: true }))
                setSelected(item)
              },
            },
            {
              label: t('control-panel.delete'),
              value: 'delete',
              icon: 'fluent:delete-16-filled',
              onClick: () => {
                setOpen(prev => ({ ...prev, delete: true }))
                setSelected(item)
              },
            },
            // {
            //   label: 'Translate',
            //   value: 'translate',
            //   icon: 'dashicons:translation',
            //   disabled: item?.localizations?.length >= 2,
            //   onClick: () => {
            //     setOpen(prev => ({ ...prev, translate: true }))
            //     setSelected(item)
            //   },
            // },
          ]}
        />
      ),
    },
  ]

  return (
    <>
      <ControlPanel
        title={t('title')}
        description={t('description')}
        actions={[
          {
            label: t('control-panel.create'),
            onClick: () => setOpen(prev => ({ ...prev, create: true })),
          },
        ]}
        search={search}
        setSearch={setSearch}
        searchPlaceholder={t('control-panel.search')}
        breadcrumbs={[
          t('control-panel.breadcrumb.1'),
          t('control-panel.breadcrumb.2'),
        ]}
      />
      <SubscriptionOptions />

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
            ? 'Edit Package'
            : selected?.id && open.translate
            ? 'Translate Package'
            : 'Create Package'
        }
      >
        <PackageForm
          translation={open.translate}
          locale={locale}
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

export default PackagePage
