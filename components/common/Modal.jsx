const Modal = ({
  size,
  title,
  open,
  setOpen,
  description,
  description2,
  children,
}) => {
  return (
    <div className={`modal  ${open ? 'open' : ''}`}>
      <div className='modal-overlay' onClick={() => setOpen(false)}></div>
      <div
        className='modal-content'
        style={{
          width: size === 'sm' ? '400px' : size === 'lg' ? '1000px' : '800px',
        }}
      >
        <div className='d-flex items-start justify-between px-30 py-20 sm:px-15 '>
          <div>
            <h5 className="tw:font-semibold tw:text-[var(--color-font-dark)] tw:text-[24px] font-primary tw:md:text-[28px]">{title}</h5>
            <p className="tw:text-[var(--color-font-regular)] tw:text-[14px] tw:md:text-[16px] tw:font-normal"
            >
              {description}
            </p>
            <p className="tw:text-[var(--color-font-regular)] tw:text-[14px] tw:md:text-[16px] tw:font-normal"
              style={{
                marginTop: '5px',
              }}
            >
              {description2}
            </p>
          </div>
          <button className='pointer ml-30' onClick={() => setOpen(false)}>
            <i className='icon-close' />
          </button>
        </div>
        <div className='modal-body  px-30 py-10 sm:px-15 sm:py-5'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
