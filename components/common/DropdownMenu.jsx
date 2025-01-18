import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'
import Link from './Link'

const Dropdown = ({ options, label, side = 'left' }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = e => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div
      className={`dropdown ${label ? 'w-100' : ''}  ${isOpen ? 'open' : ''}`}
      ref={dropdownRef}
    >
      <div className='dropdown-button w-100' onClick={toggleDropdown}>
        {label ? (
          <span className='col-12 -dark-1 bg-blue-1 text-white py-1 px-4 rounded-4'>
            {label}
          </span>
        ) : (
          <Icon icon='charm:menu-kebab' />
        )}
      </div>
      {isOpen && (
        <div
          className={`dropdown-menu ${
            dropdownRef.current
              ? dropdownRef.current.getBoundingClientRect().bottom + 200 >
                window.innerHeight
                ? `dropdown-menu-top dropdown-menu-${side}`
                : `dropdown-menu-${side}`
              : ''
          }`}
        >
          {options.map(option => {
            if (option?.disabled) return null

            return option?.href ? (
              <Link
                key={option.value}
                className='dropdown-item'
                disabled={option.disabled}
                href={option?.href}
              >
                {option?.icon && <Icon icon={option.icon} />}
                {option.label}
              </Link>
            ) : (
              <button
                key={option.value}
                className='dropdown-item'
                style={{
                  borderTop: option.divider ? '2px solid #fc4a1a' : 'none',
                  marginTop: option.divider ? '5px' : '0',
                  // paddingBottom: option.divider ? '5px' : '0',
                }}
                disabled={option.disabled}
                onClick={() => {
                  option?.onClick && option?.onClick(option)
                  setIsOpen(false)
                }}
              >
                {option?.icon && <Icon icon={option.icon} />}
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dropdown
