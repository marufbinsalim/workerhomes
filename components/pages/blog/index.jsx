'use client'

import ConfirmModal from '@/components/common/ConfirmModal'
import ControlPanel from '@/components/common/controlPanel'
import DropdownMenu from '@/components/common/DropdownMenu'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import Table from '@/components/common/table'
import BlogForm from '@/components/form/blog'
import useFetch from '@/hooks/useFetch'
import { remove } from '@/lib/services/blog'
import { formatDate } from '@/utils'
import moment from 'moment'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const BlogPage = ({ locale }) => {
  const t = useTranslations('blogs')
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
    keys: ['categories', search],
    url: '/api/blogs',
    query: {
      filters: {
        title: {
          $containsi: search || undefined,
        },
        isApproved: {
          $eq: filter?.key === 'NOT_PUBLISHED' ? false : undefined,
        },
      },
      populate: ['localizations', 'author', 'category', 'image'],
      locale,
      pagination: {
        page: search ? 1 : currentPage,
        pageSize: pageSize,
      },
      sort: [`createdAt:${filter.key === 'NEWEST' ? 'desc' : 'asc'}`],
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
      Cell: item => <span>{item?.title || 'N/A'}</span>,
    },
    {
      Header: t('table.author'),
      Cell: item => (
        <span className='lowercase'>{item?.author?.email || 'N/A'}</span>
      ),
    },
    {
      Header: t('table.category'),
      Cell: item => <span>{item?.category?.title || 'N/A'}</span>,
    },
    {
      Header: t('table.published'),
      Cell: item => <span>{item?.isApproved ? 'YES' : 'NO'}</span>,
    },
    {
      Header: t('table.created'),
      Cell: item => <span>{formatDate(item?.createdAt, true) || 'N/A'}</span>,
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

  const filterItems = [
    {
      key: null,
      value: t('control-panel.filters.all'),
    },
    {
      key: 'NOT_PUBLISHED',
      value: t('control-panel.filters.not-published'),
    },
    {
      key: 'NEWEST',
      value: t('control-panel.filters.newest'),
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
        title={
          selected?.id && open.translate
            ? 'Translate Article '
            : selected?.id && !open.translate
            ? 'Edit Article '
            : 'Create New Article '
        }
      >
        <BlogForm
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
        title='Delete Article Category'
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

export default BlogPage
