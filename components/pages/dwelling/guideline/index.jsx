'use client'

import ControlPanel from '@/components/common/controlPanel'
import DropdownMenu from '@/components/common/DropdownMenu'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import Table from '@/components/common/table'
import GuideLineForm from '@/components/form/guideline'
import useFetch from '@/hooks/useFetch'
import { remove } from '@/lib/services/quideline'
import { exactPath } from '@/utils'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const DwellingGuidelinePage = ({ locale }) => {
  const t = useTranslations('dwelling-guidelines')

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 16

  const columns = [
    {
      Header: t('table.title'),
      Cell: item => <span>{item?.title || 'N/A'}</span>,
    },
    {
      Header: t('table.description'),
      Cell: item => <span>{item?.description || 'N/A'}</span>,
    },
    {
      Header: t('table.pdf'),
      Cell: item => (
        <a href={exactPath(item?.pdf?.url)} target='__blank'>
          Download
        </a>
      ),
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
                setOpen(true)
                setSelected(item)
              },
            },
            {
              label: t('control-panel.delete'),
              value: 'delete',
              icon: 'fluent:delete-16-filled',
              onClick: async () =>
                await remove(item?.id, 'Guide line deleted successfully'),
            },
          ]}
        />
      ),
    },
  ]

  const { data, error, isLoading, pagination, reFetch } = useFetch({
    keys: ['guidlines', search],
    url: '/api/guidlines',
    query: {
      filters: {
        title: {
          $containsi: search || undefined,
        },
      },
      populate: ['pdf'],
      pagination: {
        page: search ? 1 : currentPage,
        pageSize: pageSize,
      },
    },
  })

  return (
    <>
      <ControlPanel
        title={t('title')}
        description={t('description')}
        actions={[
          {
            label: t('control-panel.create'),
            onClick: () => {
              setOpen(true)
              setSelected(null)
            },
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
        open={open}
        setOpen={() => {
          setOpen(!open)
          setSelected(null)
          reFetch()
        }}
      >
        <GuideLineForm
          formData={selected}
          onSuccess={() => {
            setOpen(false)
            setSelected(null)
            reFetch()
          }}
        />
      </Modal>
    </>
  )
}

export default DwellingGuidelinePage
