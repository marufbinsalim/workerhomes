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
    <div className={`modal ${open ? 'open' : ''}`}>
      <div className='modal-overlay' onClick={() => setOpen(false)}></div>
      <div
        className='modal-content'
        style={{
          width: size === 'sm' ? '400px' : size === 'lg' ? '1000px' : '800px',
        }}
      >
        <div className='d-flex items-start justify-between px-30 py-20 sm:px-15 border-bottom-light'>
          <div>
            <h5>{title}</h5>
            <p
              style={{
                lineHeight: '1.5',
                fontSize: '14px',
                marginTop: '10px',
              }}
            >
              {description}
            </p>
            <p
              style={{
                marginTop: '5px',
                lineHeight: '1.5',
                fontSize: '14px',
              }}
            >
              {description2}
            </p>
          </div>
          <button className='pointer ml-30' onClick={() => setOpen(false)}>
            <i className='icon-close' />
          </button>
        </div>
        <div className='modal-body px-30 py-30 sm:px-15 sm:py-15'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
