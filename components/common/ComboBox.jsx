import { useEffect, useState } from 'react'
import useFetch from '@/hooks/useFetch'
import { Icon } from '@iconify/react'

const ComboBox = ({
  label,
  name,
  url,
  onChange,
  error,
  placeholder,
  locale = 'en',
  value,
  keyValue,
  extraKeys = [],
  multiple = false,
  params,
  isRole = false,
  required = false,
  setTouched,
  selectedFirstItem = false,
  symbol,
  ...rest
}) => {
  const [changed, setChanged] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const buildNestedFilter = (keyPath, value) => {
    const keys = keyPath.split('.')
    return keys.reduceRight((acc, key) => ({ [key]: acc }), {
      $containsi: value,
    })
  }

  const {
    data: MainData,
    isLoading,
    reFetch,
  } = useFetch({
    url,
    keys: [locale],
    query: {
      ...params,
      filters: {
        ...params?.filters,
        ...buildNestedFilter(keyValue, searchTerm || undefined),
      },

      locale,
      sort: ['id:desc'],
    },
  })

  const data = isRole ? MainData?.roles : MainData

  useEffect(() => {
    if (value) {
      setSearchTerm(getNestedValue(value, keyValue) ?? '')
    }
  }, [value])

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  const handleItemClick = item => {
    if (multiple) {
      // Handle multiple selection logic here if needed
    } else {
      if (item?.id === value?.id) {
        // If the item is already selected, deselect it
        onChange(null)
        setSearchTerm('')
      } else {
        // Otherwise, select the item
        onChange(item)
        setSearchTerm(getNestedValue(item, keyValue))
      }
    }
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    if (selectedFirstItem && data) {
      onChange(data?.[0])
    }
  }, [selectedFirstItem, data])

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
            onChange={e => {
              setSearchTerm(e.target.value)
              setIsDropdownOpen(true)
              setChanged(true)
            }}
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen)
            }}
            onBlur={e => {
              if (!e.target.value) {
                onChange(null)
                setTouched && setTouched({ [name]: true })
              }
              setTimeout(() => setIsDropdownOpen(false), 200)
            }}
            value={searchTerm}
            required={required}
            placeholder={placeholder ?? 'Select an item'}
            className='combobox-input capitalize'
            {...rest}
          />
          {isDropdownOpen && (
            <div className='combobox-dropdown'>
              {data?.length <= 0 ? (
                <div className='combobox-dropdown-item' disabled>
                  No Items | Search for something
                </div>
              ) : data?.length > 0 && !isLoading ? (
                data?.map((item, index) => (
                  <div
                    key={index}
                    className={`combobox-dropdown-item capitalize ${
                      item?.id === value?.id ? 'selected' : ''
                    }`}
                    onClick={() => {
                      handleItemClick(item)
                      setChanged(true)
                    }}
                  >
                    <span>
                      {getNestedValue(item, keyValue)}{' '}
                      {extraKeys.map((key, i) => (
                        <span key={i}>
                          <Icon icon='radix-icons:dot' />
                          {getNestedValue(item, key)
                            ? `${symbol} ${getNestedValue(item, key)}`
                            : 'Unlimited'}
                        </span>
                      ))}
                    </span>
                    {item?.id === value?.id && <Icon icon='charm:cross' />}
                  </div>
                ))
              ) : (
                <div className='combobox-dropdown-item'>Loading...</div>
              )}
            </div>
          )}
        </div>
      </div>
      {error && <div className='combobox-error'>{error}</div>}
    </div>
  )
}

export default ComboBox

// import { useEffect, useState } from 'react'
// import useFetch from '@/hooks/useFetch'
// import { Icon } from '@iconify/react'

// const ComboBox = ({
//   label,
//   name,
//   url,
//   onChange,
//   error,
//   placeholder,
//   locale = 'en',
//   value,
//   keyValue,
//   extraKeys = [],
//   multiple = false,
//   params,
//   isRole = false,
//   required = false,
//   setTouched,
//   selectedId,
//   ...rest
// }) => {
//   const [searchTerm, setSearchTerm] = useState('')
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)

//   const buildNestedFilter = (keyPath, value) => {
//     const keys = keyPath.split('.')
//     return keys.reduceRight((acc, key) => ({ [key]: acc }), {
//       $containsi: value,
//     })
//   }

//   const {
//     data: MainData,
//     isLoading,
//     reFetch,
//   } = useFetch({
//     url,
//     keys: [locale],
//     query: {
//       ...params,
//       filters: {
//         ...params?.filters,
//         ...buildNestedFilter(keyValue, searchTerm || undefined),
//       },
//       locale,
//       sort: ['id'],
//     },
//   })

//   const data = isRole ? MainData?.roles : MainData

//   useEffect(() => {
//     if (value) {
//       setSearchTerm(getNestedValue(value, keyValue) ?? '')
//     }
//   }, [value])

//   const getNestedValue = (obj, path) => {
//     return path.split('.').reduce((acc, part) => acc && acc[part], obj)
//   }

//   useEffect(() => {
//     if (selectedId && data) {
//       const selected = data?.find(k => k.id === parseInt(selectedId))

//       onChange(selected)
//       setSearchTerm(getNestedValue(selected, keyValue))
//     }
//   }, [selectedId, data])

//   return (
//     <div>
//       <div
//         className={
//           error ? 'combobox-container has-error-border' : 'combobox-container'
//         }
//       >
//         <label className='lh-1 text-16 text-light-1' htmlFor={name}>
//           {'Select ' + label}
//           {required && <span className='text-danger px-2'>*</span>}
//         </label>
//         <div className='combobox-input-container'>
//           <input
//             type='text'
//             id={name}
//             name={name}
//             onChange={e => {
//               setSearchTerm(e.target.value)
//               setIsDropdownOpen(true)
//             }}
//             onClick={() => {
//               setIsDropdownOpen(!isDropdownOpen)
//             }}
//             onBlur={e => {
//               if (!e.target.value) {
//                 // If the input is blurred without a value, set the error
//                 onChange(null)
//                 setTouched && setTouched({ [name]: true })
//               }
//               setTimeout(() => setIsDropdownOpen(false), 200)
//             }}
//             value={searchTerm}
//             required={required}
//             placeholder={placeholder ?? 'Select an item'}
//             className='combobox-input'
//             {...rest}
//           />
//           {isDropdownOpen && (
//             <div className='combobox-dropdown'>
//               {data?.length <= 0 ? (
//                 <div className='combobox-dropdown-item' disabled>
//                   No Items | Search for something
//                 </div>
//               ) : data?.length > 0 && !isLoading ? (
//                 data?.map((item, index) => (
//                   <div
//                     key={index}
//                     className={`combobox-dropdown-item ${
//                       item?.id === value?.id ? 'selected' : ''
//                     }`}
//                     onClick={() => {
//                       onChange(item)
//                       setSearchTerm(getNestedValue(item, keyValue))
//                       setIsDropdownOpen(false)
//                     }}
//                   >
//                     <span>
//                       {getNestedValue(item, keyValue)}{' '}
//                       {extraKeys.map((key, i) => (
//                         <span key={i}>
//                           <Icon icon='radix-icons:dot' />
//                           {getNestedValue(item, key) || 'Unlimited'}
//                         </span>
//                       ))}
//                     </span>
//                     {item?.id === value?.id && (
//                       <Icon icon='hugeicons:tick-01' />
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className='combobox-dropdown-item'>Loading...</div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//       {error && <div className='combobox-error'>{error}</div>}
//     </div>
//   )
// }

// export default ComboBox
