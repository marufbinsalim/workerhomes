'use client'

import ConfirmModal from '@/components/common/ConfirmModal'
import ControlPanel from '@/components/common/controlPanel'
import DropdownMenu from '@/components/common/DropdownMenu'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import Table from '@/components/common/table'
import DwellingForm from '@/components/form/dwelling'
import DwellingFormStep from '@/components/form/dwelling/others/step'
import PreviewDwelling from '@/components/form/dwelling/preview'
import ReviewDwelling from '@/components/form/dwelling/review'
import { roles, url } from '@/config'
import useFetch from '@/hooks/useFetch'
import { remove } from '@/lib/services/dwelling'
import { calculateRemainingTime, exactPath, formatDate } from '@/utils'
import { Icon } from '@iconify/react'
import { useSession } from 'next-auth/react'

import SubscriptionUpgrade from '@/components/common/SupscriptionUpgrade'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'react-toastify'
import DwellingClaimsPage from './claim'
import axios from 'axios'
import CustomerNotification from '@/components/common/customerNotification'

const DwellingsPage = ({ locale }) => {
  const { data: session } = useSession()
  const t = useTranslations('dwellings')
  const tStatus = useTranslations('status')
  const tPlan = useTranslations('plan')
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    delete: false,
    translate: false,
    review: false,
    preview: false,
    claim: false,
  })
  const [sort, setSort] = useState('desc')
  const [selected, setSelected] = useState(null)
  const [formState, setFormState] = useState(null)
  const [filter, setFilter] = useState({
    key: null,
    value: 'All',
  })
  const [formId, setFormId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isValid, setIsValid] = useState(true)
  const pageSize = 16

  let approval_filter = null

  if (session?.role === roles?.user) {
    approval_filter = {
      owner: {
        id: {
          $eq: session?.id,
        },
      },
    }
  } else if (session?.role === roles?.admin) {
    approval_filter = {
      owner: {
        id: {
          $null: filter.key === 'APPROVAL' ? true : false,
        },
      },
    }
  }

  const { data, error, isLoading, pagination, reFetch } = useFetch({
    keys: ['dwellings', search, sort],
    url: '/api/dwellings',
    query: {
      filters: {
        ...approval_filter,

        subscription: {
          isExpired: {
            $eq: filter.key === 'EXPIRED' ? true : undefined,
          },
        },
        status: {
          $eq:
            filter?.key === 'PENDING' ||
            filter?.key === 'RENT' ||
            filter?.key === 'AVAILABLE'
              ? filter?.key
              : undefined,
        },
        title: {
          $containsi: search || undefined,
        },
        isRecommended: {
          $eq: filter?.key === 'RECOMMENDED' ? true : undefined,
        },
      },
      populate: [
        'icon',
        'subscription.package',
        'subscription.user',
        'guideline',
        'location',
        'localizations',
        'contact',
        'prices',
        'amenities',
        'features.icon',
        'galleries.image',
        'category',
        'seo',
        'package',
        'owner',
        'claims',
        'subscription.pending_subscription.package',
      ],
      sort: [`createdAt:${sort}`],
      locale,
      pagination: {
        page: search ? 1 : currentPage,
        pageSize: pageSize,
      },
    },
  })

  const handleDelete = async () => {
    setLoading(true)

    try {
      if (selected?.subscription?.stripe_subscription_id) {
        const results = await remove(selected?.id)

        await axios.put(`${url}/api/stripe/cancel`, {
          subscriptionId: selected?.subscription?.stripe_subscription_id,
        })

        if (results) {
          reFetch()
          toast.success(t('messages.delete-success'))
        }

        setOpen(prev => ({ ...prev, delete: false }))
        setSelected(null)
        setLoading(false)
      } else {
        const results = await remove(selected?.id)

        if (results) {
          reFetch()
          toast.success(t('messages.delete-success'))
        }

        setOpen(prev => ({ ...prev, delete: false }))
        setSelected(null)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      Header: t('table.image'),
      Cell: item => {
        const url = item?.galleries?.[0]?.image?.url
          ? item?.galleries?.[0]?.image?.url
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
      Cell: item => (
        <span className='text-truncate'>
          {item?.title?.length > 20
            ? `${item?.title?.slice(0, 20)}...`
            : item?.title || 'N/A'}
        </span>
      ),
    },
    {
      Header: t('table.status'),
      Cell: item => (
        <span className=''>
          {tStatus(item?.status) || 'N/A'}
          <br />
          <span className='d-flex align-items-center gap-2 text-blue-1 text-12'>
            {item?.status === 'PENDING' && <Icon icon='formkit:warning' />}
            {item?.status === 'PENDING'
              ? tStatus('needs-admin-approval')
              : null}
          </span>
        </span>
      ),
    },
    {
      Header: t('table.owner'),
      Cell: item => {
        if (!item?.owner?.id) {
          return <span className='badge w-100'>N/A</span>
        }

        return (
          <span>
            {item?.owner?.name || ''}
            <br />
            <span className='text-blue-1 text-12 lowercase'>
              {item?.owner?.email ? item?.owner?.email : null}
            </span>
          </span>
        )
      },
    },
    {
      Header: t('table.plan'),
      Cell: item => {
        if (!item?.subscription?.id) {
          return <span className='badge w-100'>N/A</span>
        } else {
          return (
            <span>
              {tPlan(
                `options.${item?.subscription?.package?.name?.toLowerCase()}`
              ) || 'N/A'}
              <span className='text-sm'>
                {item?.subscription?.end_date &&
                  ` (${formatDate(
                    item?.subscription?.end_date,
                    null,
                    locale
                  )})`}
              </span>
              <br />
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
                {item?.subscription?.end_date
                  ? calculateRemainingTime(item?.subscription?.end_date)
                  : 'Unlimited'}
              </span>
            </span>
          )
        }
      },
    },
    {
      Header: t('table.claims'),
      Cell: item => (
        <span>{item?.claims?.length > 0 ? item?.claims?.length : 'N/A'}</span>
      ),
    },
    {
      Header: t('table.created'),
      Cell: item => <span>{formatDate(item?.createdAt, false, locale)}</span>,
    },
    {
      Header: t('table.created_by'),
      Cell: item => {
        if (!item?.subscription?.user?.id) {
          return <span className='badge w-100'>N/A</span>
        }

        return (
          <span>
            {item?.subscription?.user?.name || ''}
            <br />
            <span className='text-blue-1 text-12 lowercase'>
              {item?.subscription?.user?.email
                ? item?.subscription?.user?.email
                : null}
            </span>
          </span>
        )
      },
      hidden: session?.role === roles.user,
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
        <div className=''>
          <span className=''>
            <DropdownMenu
              label={t('control-panel.menu')}
              options={[
                {
                  label: t('control-panel.edit'),
                  value: 'edit',
                  icon: 'fluent:edit-16-filled',
                  href: `/dashboard/dwellings/form/${item?.id}?step=1`,
                  disabled:
                    item?.subscription?.user?.id === session?.id ||
                    item?.owner?.id === session?.id
                      ? false
                      : true,
                },

                {
                  label: t('control-panel.preview'),
                  value: 'preview',
                  icon: 'fluent:preview-link-20-regular',
                  onClick: () => {
                    setOpen(prev => ({ ...prev, preview: true }))
                    setSelected(item)
                  },
                },
                {
                  label: t('control-panel.claims'),
                  value: 'claims',
                  icon: 'fluent:preview-link-20-regular',
                  disabled: item?.owner?.id ? true : false,
                  onClick: () => {
                    setOpen(prev => ({ ...prev, claim: true }))
                    setSelected(item)
                  },
                },
                {
                  label: t('control-panel.downgrade'),
                  value: 'downgrade',
                  icon: 'game-icons:armor-downgrade',
                  disabled:
                    session?.id !== item?.owner?.id ||
                    !item?.subscription?.id ||
                    !item?.subscription?.package?.name === 'Free'
                      ? true
                      : false,
                  onClick: () => {
                    if (item?.subscription?.pending_subscription?.id) {
                      return toast.warn(t('messages.pending-subscription'))
                    }
                    setOpen(prev => ({ ...prev, downgrade: true }))
                    setSelected(item)
                  },
                },
                {
                  label: t('control-panel.delete'),
                  value: 'delete',
                  icon: 'fluent:delete-16-filled',
                  onClick: () => {
                    // if (item?.subscription?.pending_subscription?.id) {
                    //   return toast.warn(t('messages.pending-subscription'))
                    // }

                    setOpen(prev => ({ ...prev, delete: true }))
                    setSelected(item)
                  },
                },

                {
                  label: t('control-panel.current-state'),
                  value: 'status',
                  icon: 'mdi:list-status',
                  onClick: () => {
                    setOpen(prev => ({ ...prev, review: true }))
                    setSelected(item)
                  },
                },
              ]}
            />
          </span>
          {!item?.subscription?.id ? null : (item?.subscription?.user?.id ===
              session?.id &&
              item?.subscription?.package?.name !== 'Platinum') ||
            (item?.owner?.id === session?.id &&
              item?.subscription?.package?.name !== 'Platinum') ? (
            <button
              onClick={() => {
                if (item?.subscription?.pending_subscription?.id) {
                  return toast.warn(t('messages.pending-subscription'))
                }

                setOpen(prev => ({ ...prev, upgrade: true }))
                setSelected(item)
              }}
              className='-dark-1 bg-blue-1 text-white  py-1 px-4 rounded-4 mt-5'
            >
              {t('control-panel.upgrade')}
            </button>
          ) : null}
        </div>
      ),
    },
  ]

  const filterItems = [
    {
      key: null,
      value: t('control-panel.filters.all'),
    },
    {
      key: 'AVAILABLE',
      value: t('control-panel.filters.available'),
    },
    {
      key: 'PENDING',
      value: t('control-panel.filters.pending'),
    },
    {
      key: 'RENT',
      value: t('control-panel.filters.rent'),
    },
    {
      key: 'RECOMMENDED',
      value: t('control-panel.filters.recommended'),
    },

    {
      key: 'EXPIRED',
      value: t('control-panel.filters.expired'),
    },
    {
      key: 'APPROVAL',
      value: t('control-panel.filters.approval'),
    },
  ]

  const handleOnClose = value => {
    setOpen(prev => ({ ...prev, create: value, edit: value }))
    setSelected(null)
    setFormState(null)
    reFetch()
  }

  const { data: userProfile, isLoading: userProfileLoading } = useFetch({
    keys: ['me'],
    url: '/api/users/me',
    query: {
      populate: ['address'],
    },
  })

  const actions =
    !userProfileLoading && userProfile?.address && userProfile?.phone
      ? [
          {
            label: t('control-panel.create'),
            href: `/dashboard/dwellings/form?step=0`,
          },
        ]
      : []

  return (
    <>
      {!userProfileLoading && (
        <CustomerNotification user={userProfile} locale={locale} />
      )}

      <ControlPanel
        title={t('title')}
        description={t('description')}
        actions={actions}
        search={search}
        setSearch={setSearch}
        searchPlaceholder={t('control-panel.search')}
        breadcrumbs={[
          t('control-panel.breadcrumb.1'),
          t('control-panel.breadcrumb.2'),
        ]}
        filterItems={session?.role === roles.user ? [] : filterItems}
        selectedFilter={filter}
        setSelectedFilter={value => setFilter(value)}
        childrenSide='left'
      >
        <button
          onClick={() => {
            setSort(sort === 'asc' ? 'desc' : 'asc')
          }}
          className='button -sm -dark-1 bg-blue-1 text-white  col-auto'
        >
          {sort === 'desc'
            ? t('control-panel.filters.old')
            : t('control-panel.filters.new')}
        </button>
      </ControlPanel>

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
        open={open.create || open.edit}
        setOpen={value => handleOnClose(value)}
        title={selected?.id ? t('modal.update.title') : t('modal.create.title')}
      >
        <DwellingFormStep
          formState={formState}
          setFormState={setFormState}
          formData={selected}
          dwellingId={formId}
          translate={open.translate}
          locale={locale}
          onSuccess={() => {
            setOpen(prev => ({ ...prev, create: false, edit: false }))
            setSelected(null)
            reFetch()
          }}
        />
      </Modal>

      <Modal
        open={open.translate}
        setOpen={value => {
          setOpen(prev => ({ ...prev, translate: value }))
          setSelected(null)
          reFetch()
        }}
        title={t('modal.translate.title')}
        description={t('modal.translate.description')}
      >
        <DwellingForm
          translation={open.translate}
          locale={locale}
          formData={selected}
          session={session}
          onSuccess={data => {
            setOpen(prev => ({ ...prev, translate: false }))
            setSelected(null)
            reFetch()
          }}
        />
      </Modal>

      <Modal
        open={open.review}
        setOpen={value => {
          setOpen(prev => ({ ...prev, review: value }))
          setSelected(null)
        }}
        title={t('modal.review.title')}
        description={t('modal.review.description')}
      >
        <ReviewDwelling
          item={selected}
          onSuccess={() => {
            setOpen(prev => ({ ...prev, review: false }))
            setSelected(null)
            reFetch()
          }}
        />
      </Modal>

      <Modal
        open={open.preview}
        size='lg'
        setOpen={value => {
          setOpen(prev => ({ ...prev, preview: value }))
          setSelected(null)
        }}
        title={t('modal.preview.title')}
        description={t('modal.preview.description')}
      >
        <PreviewDwelling data={selected} />
      </Modal>

      <Modal
        open={open.claim}
        size='lg'
        setOpen={value => {
          setOpen(prev => ({ ...prev, claim: value }))
          setSelected(null)
        }}
        title={t('modal.claims.title')}
        description={t('modal.claims.description')}
      >
        <DwellingClaimsPage
          data={selected}
          onSuccess={() => {
            setOpen(prev => ({ ...prev, claim: false }))
            setSelected(null)
            reFetch()
          }}
        />
      </Modal>

      <Modal
        open={open.upgrade || open.downgrade}
        size='lg'
        setOpen={value => {
          setOpen(prev => ({ ...prev, upgrade: value, downgrade: value }))
          setSelected(null)
        }}
        title={
          open.upgrade ? t('modal.upgrade.title') : t('modal.downgrade.title')
        }
        description={
          open.upgrade
            ? t('modal.upgrade.description')
            : t('modal.downgrade.description')
        }
        description2={
          open.upgrade
            ? t('modal.upgrade.description2')
            : t('modal.downgrade.description2')
        }
      >
        <SubscriptionUpgrade
          item={selected}
          state={open.upgrade ? 'upgrade' : 'downgrade'}
          onSuccess={() => {
            setOpen(prev => ({ ...prev, upgrade: false, downgrade: false }))
            setSelected(null)
            reFetch()
          }}
        />
      </Modal>

      <ConfirmModal
        title={t('modal.delete.title')}
        open={open.delete}
        onCancel={value => {
          setOpen(prev => ({ ...prev, delete: value }))
          setSelected(null)
        }}
        onSuccess={handleDelete}
        isLoading={loading}
        yesTitle={t('modal.delete.yes')}
        noTitle={t('modal.delete.no')}
      >
        <div>
          <ul className='mt-1 mb-3'>
            <li>
              <b>{t('modal.delete.list.0.bold')}</b>
              {t('modal.delete.list.0.text')}
            </li>
            <li>
              <b>{t('modal.delete.list.1.bold')}</b>
              {t('modal.delete.list.1.text')}
            </li>
          </ul>

          <h5 className='d-flex align-items-center gap-2'>
            <Icon icon='openmoji:warning' />
            {t('modal.delete.notice.title')}
          </h5>

          <span className=''>{t('modal.delete.notice.text')}</span>

          <br />

          <span>{t('modal.delete.description')}</span>
        </div>
      </ConfirmModal>
    </>
  )
}

export default DwellingsPage
