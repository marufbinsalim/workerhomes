import useFetch from '@/hooks/useFetch'
import { exactPath } from '@/utils'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const SelectableOptions = ({
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
  ...props
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
        // id: {
        //   $notIn:
        //     selectedItems?.length > 0
        //       ? selectedItems?.map(item => item.id)
        //       : undefined,
        // },
      },
      populate: ['icon'],
      locale,
      sort: ['id'],
      pagination: {
        limit: -1,
      },
    },
  })

  useEffect(() => {
    onChange(selectedItems)
  }, [selectedItems])

  useEffect(() => {
    setSelectedItems(values)
  }, [values])

  return (
    <div className='bg-white border px-20 py-20'>
      {label && (
        <label
          className='lh-1 text-18 fw-900 text-light-1 mb-20'
          htmlFor={name}
        >
          {label}
          {required && <span className='text-danger px-2'>*</span>}
        </label>
      )}

      <div className='row  items-center x-gap-10 y-gap-10'>
        {isLoading && data?.length === 0 ? (
          <div>Loading...</div>
        ) : data?.length === 0 ? (
          <div>No data found</div>
        ) : (
          <>
            {data?.map(item => (
              <SelectableCard
                key={item.id}
                item={item}
                isActive={selectedItems?.findIndex(i => i.id === item.id) > -1}
                onClick={item => {
                  const isAlreadySelected = selectedItems?.findIndex(
                    i => i.id === item.id
                  )

                  if (isAlreadySelected > -1) {
                    setSelectedItems(
                      selectedItems.filter(i => i.id !== item.id)
                    )
                  } else {
                    setSelectedItems([...selectedItems, item])
                  }
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default SelectableOptions

const SelectableCard = ({ item, onClick, isActive }) => {
  return (
    <div
      className={`col-auto button -sm border pointer mx-1 my-1 ${
        isActive ? 'bg-blue-1 text-white' : ''
      }`}
      style={{
        color: 'white !important',
      }}
      onClick={() => onClick(item)}
    >
      {item?.icon?.url && (
        <Image
          className='mr-10'
          src={exactPath(item?.icon?.url)}
          width={20}
          height={20}
        />
      )}
      <span className=''>{item.title}</span>
    </div>
  )
}
