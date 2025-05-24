'use client'

import { useBreadcrumbs } from '@/context/Breadcrumb'
import Breadcrumbs from './Breadcrumb'
import { useEffect } from 'react'
import ListFilter from './ListFilter'
import Link from './Link'

const ControlPanel = ({
  title,
  description,
  actions,
  isSearchable = true,
  search,
  setSearch,
  breadcrumbs = [],
  children,
  childrenSide = 'left',
  searchPlaceholder,
  filterItems,
  selectedFilter,
  setSelectedFilter,
}) => {
  const { updateBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    updateBreadcrumbs(breadcrumbs)
  }, [])

  return (
    <div className='tw:w-full  tw:space-y-2 tw:flex tw:flex-col tw:pb-2'>
      <div className='tw:flex tw:justify-between tw:items-center'>
        <div>
          {/* <h1 className='tw:text-3xl tw:font-semibold'>{title || 'Dashboard'}</h1> */}
          {/* {description && <p className='tw:text-gray-600'>{description}</p>} */}
        </div>

        {/* <div className='tw:pt-3 tw:px-3'>
          <Breadcrumbs />
        </div> */}
      </div>

      <div className='tw:w-full tw:flex tw:flex-col tw:md:flex-row tw:justify-between tw:items-start tw:gap-4'>
        <div className='tw:w-full tw:md:w-2/3'>
          <div className='tw:w-1/4 tw:mb-8'>
            {actions &&
              actions?.map((action, index) => {
                if (!action?.hidden) {
                  return action?.href ? (
                    <Link
                      href={action?.href}
                      className='tw:inline-flex tw:items-center tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700 tw:mr-2'
                      key={index}
                    >
                      {action?.label}
                    </Link>
                  ) : (
                    <button
                      key={index}
                      onClick={action?.onClick}
                      type={action?.type || 'button'}
                      className='tw:inline-flex tw:items-center tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700 tw:mr-2'
                    >
                      {action?.label}
                    </button>
                  )
                }
                return null;
              })}
          </div>
          {filterItems?.length > 0 && (
            <ListFilter
              items={filterItems}
              onSelect={setSelectedFilter}
              selected={selectedFilter}
            />
          )}
        </div>

        <div className='tw:w-full tw:md:w-1/3 tw:flex tw:flex-wrap tw:gap-2 tw:items-end tw:justify-end'>
          {childrenSide === 'left' && children}

          {isSearchable && (
            <div className='tw:flex-shrink-0'>
              <div className='tw:relative tw:flex tw:items-center tw:md:hidden'>
                <input
                  onChange={e => setSearch(e.target.value)}
                  value={search}
                  className='tw:pl-12 tw:border tw:border-gray-300 tw:text-gray-800 tw:rounded-lg tw:py-2 tw:pr-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-blue-500'
                  style={{
                    height: '40px',
                  }}
                  type='search'
                  placeholder={searchPlaceholder || 'Search...'}
                />
                <button className='tw:absolute tw:inset-y-0 tw:left-0 tw:flex tw:items-center tw:pl-3'>
                  <i className='icon-search tw:text-xl tw:text-gray-500'></i>
                </button>
              </div>
            </div>
          )}

          {children && childrenSide === 'right' && (
            <div className='tw:flex-shrink-0'>
              {childrenSide === 'right' && children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
