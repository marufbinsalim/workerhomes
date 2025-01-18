'use client'

import ConfirmModal from '@/components/common/ConfirmModal'
import ControlPanel from '@/components/common/controlPanel'
import DropdownMenu from '@/components/common/DropdownMenu'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import Table from '@/components/common/table'
import DwellingEquipmentForm from '@/components/form/dwelling/equipment'
import useFetch from '@/hooks/useFetch'
import { remove } from '@/lib/services/dwelling/equipment'
import { exactPath } from '@/utils'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

const DwellingEquipmentPage = ({ locale }) => {
  const t = useTranslations('dwelling-equipments')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    delete: false,
  })
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 16

  const { data, error, isLoading, pagination, reFetch } = useFetch({
    keys: ['features', search],
    url: '/api/features',
    query: {
      filters: {
        title: {
          $containsi: search || undefined,
        },
      },
      populate: ['icon', 'localizations'],
      locale,
      pagination: {
        page: search ? 1 : currentPage,
        pageSize: pageSize,
      },
      sort: ['title:asc'],
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
      Header: t('table.icon'),
      Cell: item => {
        return (
          <div className='pl-15'>
            {item?.icon?.url ? (
              <Image
                width={15}
                height={15}
                src={exactPath(item?.icon?.url)}
                alt='image'
                className='size-20 rounded-22 object-cover'
              />
            ) : (
              <Icon icon='fluent:draw-image-20-filled' width={15} height={15} />
            )}
          </div>
        )
      },
    },
    {
      Header: t('table.title'),
      Cell: item => <span>{item?.title || 'N/A'}</span>,
    },
    {
      Header: t('table.description'),
      Cell: item => <span>{item?.description || 'N/A'}</span>,
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
          : 'N/A',
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

      <div className='py-30 px-30 rounded-4 bg-white shadow-3 relative'>
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
        title={selected?.id ? 'Edit Equipment' : 'Create New Equipment'}
      >
        <DwellingEquipmentForm
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
        title='Delete Dwelling'
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

export default DwellingEquipmentPage
