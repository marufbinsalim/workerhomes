'use client'

import ConfirmModal from '@/components/common/ConfirmModal'
import ControlPanel from '@/components/common/controlPanel'
import DropdownMenu from '@/components/common/DropdownMenu'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import Table from '@/components/common/table'
import AmenityForm from '@/components/form/dwelling/amenity'
import { approve } from '@/lib/services/claim'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const DwellingClaims = ({ data, onSuccess }) => {
  const t = useTranslations('dwelling-amenities')
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    approve: false,
    translate: false,
  })
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 16

  const handleApprove = async () => {
    setLoading(true)
    try {
      const res = await approve({
        id: selected?.id,
        dwelling: {
          id: data?.id,
        },
      })

      if (res) {
        onSuccess && onSuccess()
        setSelected(null)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      setOpen(prev => ({ ...prev, approve: false }))
    }
  }

  const columns = [
    {
      Header: 'First name',
      Cell: item => <span>{item?.first_name || 'N/A'}</span>,
    },
    {
      Header: 'Last name',
      Cell: item => <span>{item?.last_name || 'N/A'}</span>,
    },
    {
      Header: 'Email',
      Cell: item => item?.email,
    },
    {
      Header: 'Description',
      Cell: item => (item?.description ? item?.description : 'N/A'),
    },
  ]

  const columns2 = data?.claims?.find(item => item?.isApproved === true)
    ? [
        ...columns,
        {
          Header: 'Actions',
          Cell: item => {
            if (item?.isApproved) {
              return <span className='text-green-500'>YES</span>
            } else {
              return <span>No</span>
            }
          },
        },
      ]
    : [
        ...columns,
        {
          Header: 'Actions',
          Cell: item => (
            <button
              className='btn btn-primary'
              onClick={() => {
                setSelected(item)
                setOpen(prev => ({ ...prev, approve: true }))
              }}
            >
              Approve
            </button>
          ),
        },
      ]

  return (
    <>
      <div className='pb-30 rounded-4 bg-white shadow-3'>
        <Table data={data?.claims} columns={columns2} fullHeight={false} />
      </div>

      <ConfirmModal
        title='Are you sure want to approve this claim.'
        message="Once you approve this claim, it can't be undone."
        open={open.approve}
        onCancel={value => {
          setOpen(prev => ({ ...prev, approve: value }))
          setSelected(null)
        }}
        onSuccess={handleApprove}
        isLoading={loading}
      />
    </>
  )
}

export default DwellingClaims
