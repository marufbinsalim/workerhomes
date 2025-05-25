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
import { FaRegArrowAltCircleDown, FaRegEdit, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'
import { IoWarningOutline } from 'react-icons/io5'
import { FiEye } from 'react-icons/fi'
import { GrUpgrade } from "react-icons/gr";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin7Line, RiDeleteBinLine } from "react-icons/ri";
import Link from 'next/link'




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
      Header: t('table.title'),
      Cell: item => (
        <div className="tw:flex tw:items-center tw:gap-3">
          <div
            className="tw:relative tw:w-[100px] tw:h-[100px] tw:p-[4.84px] tw:border-2 tw:border-solid tw:border-gray-200 tw:rounded-md"
          >
            <Image
              src={exactPath(item?.galleries?.[0]?.image?.url
                ? item?.galleries?.[0]?.image?.url
                : '/uploads/demo_cbcb7e3dc1.png')}
              alt={item?.title}
              fill
              className="tw:object-cover tw:rounded"
            />
          </div>
          <span className="tw:text-sm tw:font-normal tw:text-[var(--color-font-dark)] ">
            {item?.title?.length > 20
              ? `${item?.title?.slice(0, 20)}...`
              : item?.title || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      Header: t('table.status'),
      Cell: item => {
        let statusClass = '';
        if (item?.status === 'AVAILABLE') {
          statusClass = 'tw:bg-[var(--color-green-light)] tw:font-normal tw:text-[var(--color-green)]';
        } else if (item?.status === 'PENDING') {
          statusClass = 'tw:bg-[#FFECD1] tw:text-amber-600';
        } else if (item?.status === 'CANCELLED') {
          statusClass = 'tw:bg-[#FFDADE] tw:text-red-600';
        }

        return (
          <div className="tw:flex tw:flex-col tw:gap-2">
            <span className={`tw:inline-flex tw:items-center tw:justify-center tw:w-[76px] tw:h-[32px] tw:p-2 tw:rounded-lg tw:text-sm tw:font-medium ${statusClass}`}>
              {item?.status === 'AVAILABLE' ? 'Approved' : tStatus(item?.status)}
            </span>
            {item?.status === 'PENDING' && (
              <span className="tw:flex tw:items-center tw:gap-2 tw:text-blue-500 tw:text-xs">
                <Icon icon='formkit:warning' />
                {tStatus('needs-admin-approval')}
              </span>
            )}
          </div>
        );
      },
    },
    {
      Header: t('table.owner'),
      Cell: item => {
        if (!item?.owner?.id) {
          return <span className='tw:badge'>N/A</span>;
        }
        return (
          <span className='tw:text-sm tw:font-normal tw:text-[var(--color-font-dark)]'>
            {item?.owner?.name || ''}
            <br />
            <span className='tw:text-[var(--color-font-light)] tw:text-xs tw:lowercase'>
              {item?.owner?.email || null}
            </span>
          </span>
        );
      },
    },
    {
      Header: t('table.plan'),
      Cell: item => {
        if (!item?.subscription?.id) {
          return <span className='tw:badge'>N/A</span>;
        }

        return (
          <div className="tw:relative tw:group">
            <span className='tw:text-[var(--color-primary)] tw:text-sm tw:font-normal'>
              {tPlan(`options.${item?.subscription?.package?.name?.toLowerCase()}`) || 'N/A'}
              {item?.subscription?.end_date &&
                ` (${formatDate(item?.subscription?.end_date, null, locale)})`}
            </span>
            {item?.status === 'PENDING' && (
              <>
                <IoWarningOutline className="tw:inline tw:ml-2 tw:text-yellow-500" />
                <span className="tw:absolute tw:left-0 tw:bottom-full tw:mb-1 tw:p-2 tw:bg-white tw:shadow-md tw:rounded tw:text-xs tw:text-gray-600 tw:hidden group-tw:hover:block tw:z-10 tw:w-40">
                  Needs admin approval
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      Header: t('table.created'),
      Cell: item => (
        <span className='tw:text-[var(--color-font-dark)] tw:font-normal tw:text-[14px] '>{formatDate(item?.createdAt, false, locale)}</span>
      ),
    },
    {
      Header: "Action",
      Cell: item => (
        <div className="tw:flex tw:items-center tw:justify-end tw:gap-4">
          {(!item?.subscription?.id ||
            (item?.subscription?.user?.id === session?.id &&
              item?.subscription?.package?.name !== 'Platinum') ||
            (item?.owner?.id === session?.id &&
              item?.subscription?.package?.name !== 'Platinum')) && (
              <div className="tw:relative tw:group">
                <button
                  onClick={() => {
                    if (item?.subscription?.pending_subscription?.id) {
                      return toast.warn(t('messages.pending-subscription'));
                    }
                    setOpen(prev => ({ ...prev, upgrade: true }));
                    setSelected(item);
                  }}
                  className="tw:text-[var(--color-red)] "
                >
                  <GrUpgrade size={24} />
                </button>
                <div className="tw:absolute tw:hidden tw:group-hover:flex tw:z-10 
                  tw:bottom-full tw:left-1/2 tw:-translate-x-[50%] tw:mb-2
                  tw:w-[88px] tw:h-[36px] tw:px-6 tw:py-[10px]
                  tw:items-center tw:justify-center tw:bg-white
                  tw:rounded tw:shadow-sm tw:whitespace-nowrap 
                  tw:text-[var(--color-font-regular)] tw:text-sm tw:text-center">
                  Upgrade
                </div>
              </div>
            )}

          <div className="tw:relative tw:group">

            <Link href={`/dashboard/dwellings/form/${item?.id}?step=1`}>
              <button className="tw:text-[var(--color-font-dark)]">
                <FaRegEdit size={24} />
              </button>
            </Link>

            <div className="tw:absolute tw:hidden tw:group-hover:flex tw:z-10 
                  tw:bottom-full tw:left-1/2 tw:-translate-x-[50%] tw:mb-2
                  tw:w-[88px] tw:h-[36px] tw:px-6 tw:py-[10px]
                  tw:items-center tw:justify-center tw:bg-white
                  tw:rounded tw:shadow-sm tw:whitespace-nowrap 
                  tw:text-[var(--color-font-regular)] tw:text-sm tw:text-center">
              Edit
            </div>
          </div>

          <div className="tw:relative tw:group">
            <button
              onClick={() => {
                setOpen(prev => ({ ...prev, preview: true }));
                setSelected(item);
              }}
              className="tw:text-[var(--color-font-dark)] hover:tw:text-gray-700"
            >
              <FiEye size={24} />
            </button>
            <div className="tw:absolute tw:hidden tw:group-hover:flex tw:z-10 
                  tw:bottom-full tw:left-1/2 tw:-translate-x-1/2 tw:mb-2
                  tw:w-[88px] tw:h-[36px] tw:px-6 tw:py-[10px]
                  tw:items-center tw:justify-center tw:bg-white
                  tw:rounded tw:shadow-sm tw:whitespace-nowrap 
                  tw:text-[var(--color-font-regular)] tw:text-sm tw:text-center">
              View
            </div>
          </div>

          <div className="tw:relative tw:group">
            <DropdownMenu
              trigger={
                <BsThreeDots size={24} className="tw:text-[var(--color-font-dark)] " />
              }
              options={[
                {
                  value: 'downgrade',
                  label: 'Downgrade',
                  icon: <FaRegArrowAltCircleDown size={24} className="tw:text-[var(--color-font-dark)] " />,
                  onClick: () => {
                    if (item?.subscription?.pending_subscription?.id) {
                      return toast.warn(t('messages.pending-subscription'));
                    }
                    setOpen(prev => ({ ...prev, downgrade: true }));
                    setSelected(item);
                  }
                },
                {
                  value: 'delete',
                  label: 'Delete',
                  icon: <RiDeleteBinLine size={24} className="tw:text-[var(--color-font-dark)] " />,
                  onClick: () => {
                    setOpen(prev => ({ ...prev, delete: true }));
                    setSelected(item);
                  }
                }
              ]}
            />
            <div className="tw:absolute tw:hidden tw:group-hover:flex tw:z-10 
                  tw:bottom-full tw:left-1/2 tw:-translate-x-[50%] tw:mb-2
                  tw:w-[88px] tw:h-[36px] tw:px-6 tw:py-[10px]
                  tw:items-center tw:justify-center tw:bg-white
                  tw:rounded tw:shadow-sm tw:whitespace-nowrap 
                  tw:text-[var(--color-font-regular)] tw:text-sm tw:text-center">
              More
            </div>
          </div>
        </div>
      ),
    }
  ];

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
          label: "Create a listing",
          href: `/dashboard/dwellings/form?step=0`,
        },
      ]
      : []

  return (
    <>
      <div className="tw:p-2">
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
              setSort(sort === 'asc' ? 'desc' : 'asc');
            }}
            className="tw:inline-flex tw:items-center tw:justify-center tw:w-[170px] tw:h-[40px] tw:gap-2 tw:pt-2 tw:pr-5 tw:pb-2 tw:pl-5 tw:text-sm tw:font-semibold tw:rounded-lg tw:border tw:border-solid tw:border-[#FF780B] tw:text-[#FF780B] tw:hover:bg-[#FF780B]/10 tw:transition-all tw:duration-200"
          >
            {sort === 'desc'
              ? t('control-panel.filters.old')
              : t('control-panel.filters.new')}

            {sort === 'asc' ? (
              <FaSortAmountUp className="tw:w-4 tw:h-4 tw:ml-1" />
            ) : (
              <FaSortAmountDown className="tw:w-4 tw:h-4 tw:ml-1" />
            )}
          </button>
        </ControlPanel>

        <div className='tw:rounded-lg tw:min-h-[calc(100dvh-150px)] tw:max-h-[calc(100dvh-150px)] tw:gap-[30px] tw:p-4 tw:flex tw:flex-col'>
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
      </div>
    </>
  )
}

export default DwellingsPage
