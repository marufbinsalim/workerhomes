import { useTranslations } from 'next-intl'
import React from 'react'
import Modal from './Modal'
import ClaimForm from '@/components/form/claim'
import { Icon } from '@iconify/react'
import ReCaptchaProvider from '@/context/ReCaptchaProvider'

const ClaimButton = ({ dwelling }) => {
  const t = useTranslations('claim')
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button
        type='button'
        onClick={() => {
          setOpen(!open)
        }}
        className='button px-24 h-50 -dark-1 bg-blue-1 text-white'
      >
        {t('control-panel.create')}
        <Icon icon='akar-icons:arrow-right' className='ml-10' />
      </button>
      <ReCaptchaProvider>
        <Modal
          title={t('title')}
          description={t('description')}
          open={open}
          setOpen={() => {
            setOpen(!open)
          }}
        >
          <ClaimForm
            dwelling={dwelling}
            onSuccess={() => {
              setOpen(!open)
            }}
          />
        </Modal>
      </ReCaptchaProvider>
    </>
  )
}

export default ClaimButton
