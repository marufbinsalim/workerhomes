'use client'

import ConfirmModal from '@/components/common/ConfirmModal'
import ControlPanel from '@/components/common/controlPanel'
import DropdownMenu from '@/components/common/DropdownMenu'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import Table from '@/components/common/table'
import UserForm from '@/components/form/user'
import { roles } from '@/config'
import useFetch from '@/hooks/useFetch'
import { remove } from '@/lib/services/user'
import { exactPath } from '@/utils'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

const UserPage = ({ locale }) => {
  const t = useTranslations('users')
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

  const columns = [
    {
      Header: t('table.icon'),
      Cell: item => {
        return (
          <div className='pl-15'>
            {item?.image?.url ? (
              <Image
                width={20}
                height={20}
                src={exactPath(item?.image?.url)}
                alt='image'
                className='size-20 rounded-22 object-cover'
              />
            ) : (
              <Icon icon='lets-icons:user-alt-duotone' width={20} height={20} />
            )}
          </div>
        )
      },
    },
    {
      Header: t('table.f-name'),
      Cell: item => <span>{item?.first_name || 'N/A'}</span>,
    },
    {
      Header: t('table.l-name'),
      Cell: item => <span>{item?.last_name || 'N/A'}</span>,
    },
    {
      Header: t('table.email'),
      Cell: item => (
        <a href={`mailto:${item?.email}`} className='lowercase text-blue-1'>
          {item?.email || 'N/A'}
        </a>
      ),
    },
    {
      Header: t('table.blocked'),
      Cell: item => <span>{item?.blocked ? 'YES' : 'NO'}</span>,
    },
    {
      Header: t('table.confirmed'),
      Cell: item => <span>{item?.confirmed ? 'YES' : 'NO'}</span>,
    },
    {
      Header: t('table.role'),
      Cell: item => <span>{item?.role?.name || 'N/A'}</span>,
    },
    {
      Header: t('table.role'),
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
          ]}
        />
      ),
    },
  ]

  const { data, error, isLoading, pagination, reFetch } = useFetch({
    keys: ['users', search],
    url: '/api/users',
    query: {
      filters: {
        email: {
          $containsi: search || undefined,
        },
        blocked: filter?.key === 'BLOCKED' ? true : undefined,
        confirmed: filter?.key === 'NOT_CONFIRMED' ? false : undefined,
        role: {
          type: {
            $eq:
              filter?.key === 'ADMIN'
                ? roles.admin
                : filter?.key === 'USER'
                ? roles.user
                : undefined,
          },
        },
      },
      locale,
      populate: ['image', 'role', 'package'],
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

  const filterItems = [
    {
      key: null,
      value: t('control-panel.filters.all'),
    },
    {
      key: 'ADMIN',
      value: t('control-panel.filters.admin'),
    },
    {
      key: 'USER',
      value: t('control-panel.filters.user'),
    },
    {
      key: 'BLOCKED',
      value: t('control-panel.filters.blocked'),
    },
    {
      key: 'NOT_CONFIRMED',
      value: t('control-panel.filters.confirmed'),
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
        title={selected?.id ? 'Edit User' : 'Create New User'}
      >
        <UserForm
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
        title='Delete User'
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

export default UserPage
