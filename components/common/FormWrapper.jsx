import { Icon } from '@iconify/react'
import React from 'react'

const FormWrapper = ({
  open,
  setOpen,
  className,
  children,
  title = '',
  buttonTitle = '',
}) => {
  return (
    <div className={`form-wrapper-container row ${className}`}>
      {open && (
        <div className={`form-wrapper-body ${className}`}>
          <div className='form-wrapper-body-header'>
            <h6>{title}</h6>
            <Icon
              icon='flowbite:close-outline'
              onClick={() => setOpen(false)}
            />
          </div>
          <div className='form-wrapper-body-content'>{children}</div>
        </div>
      )}
      {!open && (
        <div
          className='text-brand pointer mb-10 border w-auto rounded '
          onClick={() => setOpen(true)}
        >
          <Icon icon='heroicons:plus-16-solid' className='mr-10' />
          {buttonTitle || 'Add New'}
        </div>
      )}
    </div>
  )
}

export default FormWrapper
