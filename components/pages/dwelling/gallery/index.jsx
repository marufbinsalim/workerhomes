'use client'

import ConfirmModal from '@/components/common/ConfirmModal'
import ControlPanel from '@/components/common/controlPanel'
import DropdownMenu from '@/components/common/DropdownMenu'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import Table from '@/components/common/table'
import DwellingEquipmentForm from '@/components/form/dwelling/equipment'
import GalleryForm from '@/components/form/dwelling/gallery'
import useFetch from '@/hooks/useFetch'
import { remove } from '@/lib/services/dwelling/equipment'
import { exactPath } from '@/utils'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

const GalleryPage = ({ locale }) => {
  const t = useTranslations('galleries')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    delete: false,
    translate: false,
  })
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 16

  const { data, error, isLoading, pagination, reFetch } = useFetch({
    keys: ['galleries', search],
    url: '/api/galleries',
    query: {
      filters: {
        note: {
          $containsi: search || undefined,
        },
      },
      locale,
      populate: ['image', 'localizations', 'dwelling'],
      pagination: {
        page: search ? 1 : currentPage,
        pageSize: pageSize,
      },
      sort: ['createdAt:asc'],
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
      Header: 'Image',
      Cell: item => {
        return (
          <div className='pl-15'>
            {item?.image?.url ? (
              <Image
                width={60}
                height={60}
                src={exactPath(item?.image?.url)}
                alt='image'
                className='size-20 rounded-22 object-cover'
              />
            ) : (
              <Icon icon='akar-icons:image' width={30} height={30} />
            )}
          </div>
        )
      },
    },
    {
      Header: 'Placement Order',
      Cell: item => <span>{item?.order || 'N/A'}</span>,
    },
    {
      Header: 'Description',
      Cell: item => <span>{item?.note || 'N/A'}</span>,
    },
    {
      Header: 'Options',
      Cell: item => (
        <DropdownMenu
          options={[
            {
              label: 'Edit',
              value: 'edit',
              icon: 'fluent:edit-16-filled',
              onClick: () => {
                setOpen(prev => ({ ...prev, edit: true }))
                setSelected(item)
              },
            },
            {
              label: 'Delete',
              value: 'delete',
              icon: 'fluent:delete-16-filled',
              onClick: () => {
                setOpen(prev => ({ ...prev, delete: true }))
                setSelected(item)
              },
            },
            {
              label: 'Translate',
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
            label: t('create'),
            onClick: () => setOpen(prev => ({ ...prev, create: true })),
          },
        ]}
        search={search}
        setSearch={setSearch}
        breadcrumbs={['Dashboard', 'Dwellings', t('title')]}
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
        title={
          selected?.id && open.translate
            ? 'Translate Dwelling Gallery'
            : selected?.id && !open.translate
            ? 'Edit Dwelling Gallery'
            : 'Create New Dwelling Gallery'
        }
      >
        <GalleryForm
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
        title='Delete Gallery'
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

export default GalleryPage
