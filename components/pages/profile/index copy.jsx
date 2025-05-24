'use client'

import ConfirmModal from '@/components/common/ConfirmModal'
import ControlPanel from '@/components/common/controlPanel'
import CustomerCard from '@/components/common/CustomerCard'
import Divider from '@/components/common/Divider'
import Modal from '@/components/common/Modal'
import ProfileForm from '@/components/form/profile'
import PasswordForm from '@/components/form/profile/password'
import PaymentMethodForm from '@/components/form/profile/payment-method'
import PasswordVerifiedForm from '@/components/form/profile/verifiedPassword'
import { url } from '@/config'
import useFetch from '@/hooks/useFetch'
import { remove } from '@/lib/services/user'
import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const ProfilePage = ({ locale }) => {
  const t = useTranslations('profile')
  const { data: session } = useSession()
  const [open, setOpen] = useState({
    delete: false,
    deleteConfirm: false,
    password: false,
    payment: false,
  })
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [filter, setFilter] = useState({
    key: null,
    value: 'All',
  })
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const { data, isLoading, reFetch } = useFetch({
    keys: ['me'],
    url: '/api/users/me',
    query: {
      populate: ['address', 'subscriptions'],
    },
  })

  const handleDelete = async () => {
    setLoading(true)
    try {
      if (data?.subscriptions?.length > 0) {
        for (const subscription of data?.subscriptions) {
          await axios.put(`${url}/api/stripe/cancel`, {
            subscriptionId: subscription?.stripe_subscription_id,
          })
        }
      }

      const res = await remove(data?.id, t('messages.delete-success'))
      if (res?.status === 200 || res?.status === 201) {
        signOut({
          redirect: true,
          callbackUrl: `/${locale}`,
        })
      }
      setOpen(prev => ({ ...prev, delete: false }))
      setSelected(null)
      setLoading(false)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=''>
      <ControlPanel
        title={t('title')}
        description={t('messages.ok')}
        breadcrumbs={[
          t('control-panel.breadcrumb.1'),
          t('control-panel.breadcrumb.2'),
        ]}
        isSearchable={false}
      />

      <div className='py-30  rounded-4 bg-white shadow-3 px-40'>
        {isLoading ? (
          <div>{t('messages.loading')}</div>
        ) : (
          <>
            <ProfileForm formData={data} onSuccess={() => signOut()} />

            <Divider side='center' title={t('form.field.payment-methods')} />

            <div className='col-span-2 row justify-between items-center '>
              <CustomerCard
                customer={session?.stripe_customer_id}
                locale={locale}
              />
            </div>

            <Divider side='center' title={t('messages.auth')} />

            {session?.provider === 'credentials' && (
              <button
                className='col-auto button -sm bg-danger'
                onClick={() =>
                  setOpen({
                    password: true,
                    deleteConfirm: false,
                    delete: false,
                  })
                }
              >
                {t('control-panel.password')}
              </button>
            )}

            <button
              className='col-auto button -sm bg-danger mt-10'
              onClick={() =>
                setOpen({
                  delete: true,
                  deleteConfirm: false,
                  password: false,
                })
              }
            >
              {t('control-panel.deleteAccount')}
            </button>
          </>
        )}
      </div>

      {session?.provider === 'credentials' && (
        <>
          <Modal
            open={open.password}
            setOpen={value => {
              setOpen({
                delete: false,
                password: false,
              })
              setSelected(null)
            }}
            title={t('messages.change')}
          >
            <PasswordForm
              formData={data}
              onSuccess={() => {
                setIsUserVerified(true)
                setOpen({
                  delete: false,
                  deleteConfirm: false,
                  password: false,
                })
              }}
            />
          </Modal>

          <Modal
            open={open.deleteConfirm}
            setOpen={value => {
              setOpen({
                delete: false,
                deleteConfirm: false,
                password: false,
              })
              setSelected(null)
            }}
            title={t('messages.verify-password')}
          >
            <PasswordVerifiedForm
              isLoading={isLoading}
              formData={data}
              onSuccess={async () => {
                await handleDelete()
                // await signOut({
                //   redirect: true,
                //   callbackUrl: `/${locale}`,
                // })

                // Clear cookies
                // document.cookie = 'next-auth.session-token=; Max-Age=0; path=/'
                // document.cookie =
                //   '__Secure-next-auth.session-token=; Max-Age=0; path=/; Secure'

                // // Clear localStorage
                // localStorage?.removeItem('next-auth.session-token')
              }}
            />
          </Modal>
        </>
      )}

      <Modal
        open={open.payment}
        setOpen={value => {
          setOpen({
            delete: false,
            deleteConfirm: false,
            password: false,
            payment: value,
          })
          setSelected(null)
        }}
        title={t('form.field.payment-methods')}
      >
        <PaymentMethodForm
          editData={data}
          onSuccess={() => {
            setOpen({
              delete: false,
              deleteConfirm: false,
              password: false,
              payment: false,
            })
            reFetch()
          }}
        />
      </Modal>

      <ConfirmModal
        size='lg'
        title={t('messages.delete-account')}
        open={open.delete}
        onCancel={value => {
          setOpen(prev => ({ ...prev, delete: value }))
          setSelected(null)
        }}
        onSuccess={() => {
          if (session?.provider === 'credentials') {
            setOpen(prev => ({ ...prev, delete: false, deleteConfirm: true }))
          } else {
            handleDelete()
          }
        }}
        isLoading={loading}
      >
        <p>{t('messages.delete.1')}</p>
        <p className='mt-2'>{t('message.delete.2')}</p>
        <ul className='mb-10'>
          <li>
            <strong>1:</strong> {t('messages.delete.list.1')}
          </li>
          <li>
            <strong>2:</strong> {t('messages.delete.list.2')}
          </li>
          <li>
            <strong>3:</strong> {t('messages.delete.list.3')}
          </li>
        </ul>
        <p>{t('messages.delete.3')}</p>
        <p className='mt-4'>
          <i>{t('messages.delete.4')}</i>
        </p>
      </ConfirmModal>
    </div>
  )
}

export default ProfilePage
