'use client'

import ConfirmModal from '@/components/common/ConfirmModal'
import ControlPanel from '@/components/common/controlPanel'
import DropdownMenu from '@/components/common/DropdownMenu'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import Table from '@/components/common/table'
import LocationForm from '@/components/form/location'
import CountryForm from '@/components/form/location/country'
import useFetch from '@/hooks/useFetch'
import { remove } from '@/lib/services/location/country'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const CountryPage = ({ locale }) => {
  const t = useTranslations('location-countries')
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
    keys: ['countries', search],
    url: '/api/countries',
    query: {
      filters: {
        name: {
          $containsi: search || undefined,
        },
      },
      locale,
      populate: ['localizations'],
      pagination: {
        page: search ? 1 : currentPage,
        pageSize: pageSize,
      },
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
      Header: t('table.name'),
      Cell: item => <span>{item?.name || 'N/A'}</span>,
    },
    {
      Header: t('table.code'),
      Cell: item => <span>{item?.code || 'N/A'}</span>,
    },
    {
      Header: t('table.currency'),
      Cell: item => <span>{item?.currency || 'N/A'}</span>,
    },
    {
      Header: t('table.translation'),
      Cell: item =>
        item?.localizations?.length > 0
          ? item?.localizations?.map((lng, i) => (
              <span key={i} className='capitalize'>
                {lng.locale},{' '}
              </span>
            ))
          : null,
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
            {
              label: t('control-panel.translate'),
              value: 'translate',
              icon: 'dashicons:translation',
              disabled: item?.localizations?.length >= 2,
              onClick: () => {
                setOpen(prev => ({ ...prev, translate: true }))
                setSelected(item)
              },
            },
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
          t('control-panel.breadcrumb.3'),
        ]}
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
            ? 'Edit Country'
            : selected?.id && open.translate
            ? 'Translate Country'
            : 'Create Country'
        }
      >
        <CountryForm
          locale={locale}
          translation={open.translate}
          formData={selected?.id ? selected : null}
          onSuccess={() => {
            setOpen(false)
            reFetch()
          }}
        />
      </Modal>

      <ConfirmModal
        title='Delete Country'
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

export default CountryPage
