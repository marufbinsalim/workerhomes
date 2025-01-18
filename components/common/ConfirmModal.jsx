import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'

const ConfirmModal = ({
  title,
  open,
  onSuccess,
  onCancel,
  message = '',
  isLoading = false,
  children,
  style,
  btnSm = false,
  absolute = false,
  yesTitle = '',
  noTitle = '',
  size,
}) => {
  const t = useTranslations('confirm')

  const absoluteStyle = absolute
    ? {
        zIndex: 9999,
        position: 'absolute',
        top: 0,
      }
    : {}

  return (
    <div className={`modal ${open ? 'open' : ''}`} style={absoluteStyle}>
      <div className='modal-overlay' onClick={() => onCancel(false)}></div>
      <div
        className='modal-content'
        style={{
          width: size === 'sm' ? '400px' : size === 'lg' ? '800px' : '600px',
        }}
      >
        <div className='d-flex items-center justify-between px-30 py-10 sm:px-15 border-bottom-light'>
          <h5>{title}</h5>
          <button className='pointer' onClick={() => onCancel(false)}>
            <i className='icon-close' />
          </button>
        </div>
        <div
          className='modal-body px-30 py-10 sm:px-15 sm:py-15'
          style={{
            lineHeight: absolute ? '1.5' : '',
          }}
        >
          {message}

          {children}
        </div>

        <div className='modal-footer'>
          <button
            className={`col-auto ${btnSm ? 'btn btn-sm' : 'button'} -sm cancel`}
            onClick={() => onCancel(false)}
          >
            {noTitle ? noTitle : t('reject')}
          </button>
          <button
            className={`col-auto ${
              btnSm ? 'btn btn-sm' : 'button'
            } -sm success text-white  `}
            onClick={onSuccess}
          >
            {yesTitle ? yesTitle : t('confirm')}
            <Icon
              icon={isLoading ? 'line-md:loading-loop' : 'line-md:confirm'}
              className='ml-10'
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
