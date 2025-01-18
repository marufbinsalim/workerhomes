import useFetch from '@/hooks/useFetch'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'

const MultipleSelect = ({
  label,
  name,
  url,
  onChange,
  required,
  error,
  placeholder,
  locale = 'en',
  values = [],
  keyValue,
  setTouched,
  ...rest
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState(values ?? [])

  const { data, isLoading, reFetch } = useFetch({
    url,
    keys: [locale],
    query: {
      filters: {
        [keyValue]: {
          $containsi: searchTerm || undefined,
        },
        id: {
          $notIn:
            selectedItems?.length > 0
              ? selectedItems?.map(item => item.id)
              : undefined,
        },
      },
      locale,
      sort: ['id'],
    },
  })

  useEffect(() => {
    onChange(selectedItems)
  }, [selectedItems])

  useEffect(() => {
    setSelectedItems(values)
  }, [values])

  return (
    <div>
      <div
        className={
          error ? 'combobox-container has-error-border' : 'combobox-container'
        }
      >
        <label className='lh-1 text-16 text-light-1' htmlFor={name}>
          {label}
          {required && <span className='text-danger px-2'>*</span>}
        </label>
        <div className='combobox-input-container'>
          <input
            type='text'
            id={name}
            name={name}
            setSelectedItems={e => {
              setSearchTerm(e.target.value)
              setIsDropdownOpen(true)
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            // onBlur={e => {
            //   if (values?.length <= 0) {
            //     onChange([])
            //     setTouched && setTouched({ [name]: true })
            //   }
            //   setTimeout(() => setIsDropdownOpen(true), 200)
            // }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={placeholder ?? `Search by ${keyValue}`}
            className='combobox-input'
            {...rest}
          />
          {isDropdownOpen && (
            <div className='combobox-dropdown'>
              <div
                className=' sticky-top d-flex justify-content-end py-2 px-5 align-items-center cursor-pointer'
                onClick={() => setIsDropdownOpen(false)}
              >
                <Icon icon='eva:close-outline' />
              </div>
              {data?.length <= 0 ? (
                <div className='combobox-dropdown-item text-center' disabled>
                  No data found, please try with another search term.
                </div>
              ) : data?.length > 0 && !isLoading ? (
                data?.map((item, index) => (
                  <div
                    key={index}
                    className='combobox-dropdown-item'
                    onClick={() => {
                      setSelectedItems([...selectedItems, item])
                      setSearchTerm('')
                    }}
                  >
                    {item?.[keyValue]}
                  </div>
                ))
              ) : (
                <div className='combobox-dropdown-item'>Loading...</div>
              )}
            </div>
          )}
        </div>

        <div className='multiple-select-items-container'>
          {selectedItems && selectedItems?.length > 0 && (
            <div className='multiple-select-items'>
              {selectedItems?.map((item, index) => (
                <div key={index} className='multiple-select-item'>
                  {item?.[keyValue]}
                  <Icon
                    icon='fluent:delete-16-filled'
                    className='multiple-select-item-remove'
                    width={15}
                    height={15}
                    onClick={() => {
                      setSelectedItems(prev =>
                        prev.filter(i => i && item && i.id !== item.id)
                      )
                      // setSelectedItems(prev => prev.filter(i => i?.id !== item?.id))
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <div className='combobox-error'>{error}</div>}
    </div>
  )
}

export default MultipleSelect
