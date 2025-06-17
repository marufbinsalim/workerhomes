'use client'

import { useBreadcrumbs } from '@/context/Breadcrumb'
import Breadcrumbs from './Breadcrumb'
import { useEffect } from 'react'
import ListFilter from './ListFilter'
import Link from './Link'
import { FiPlus } from 'react-icons/fi'

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
    <div className='tw:w-full tw:mt-18 font-secondary tw:md:px-[18px] tw:flex tw:flex-col'>
      <div className='tw:w-full tw:flex  tw:flex-row tw:gap-4 tw:md:justify-between tw:md:items-start'>
        {/* Left Section - Actions and Filters */}
        <div className='tw:flex tw:flex-col  tw:gap-4 tw:sm:flex-row tw:sm:items-center tw:sm:gap-2'>
          {/* Actions */}
          <div className='tw:flex tw:flex-wrap tw:gap-2'>
            {actions?.map((action, index) => {
              if (!action?.hidden) {
                return action?.href ? (
                  <Link
                    href={action?.href}
                    className="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:min-w-[174px] tw:h-[40px] tw:px-5 tw:py-2 tw:text-sm tw:font-semibold  tw:bg-[#FF780B] tw:text-white hover:tw:bg-[#E56B08]"
                    key={index}
                  >
                    <FiPlus className="tw:w-5 tw:h-5" />
                    {action?.label}
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={action?.onClick}
                    type={action?.type || 'button'}
                    className='tw:inline-flex tw:items-center tw:justify-center tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700'
                  >
                    {action?.label}
                  </button>
                );
              }
              return null;
            })}
          </div>

          {/* Filters */}
          {filterItems?.length > 0 && (
            <ListFilter
              items={filterItems}
              onSelect={setSelectedFilter}
              selected={selectedFilter}
            />
          )}
        </div>

        {/* Right Section - Search and Children */}
        <div className='tw:flex tw:flex-col tw:gap-4  tw:mb-3 tw:md:mb-0 tw:sm:flex-row tw:sm:items-center tw:sm:justify-end tw:md:w-1/3'>
          {/* Children on left (mobile first) */}
          {childrenSide === 'left' && (
            <div className='tw:w-full tw:sm:w-auto'>
              {children}
            </div>
          )}

          {/* Search */}
          {isSearchable && (
            <div className='tw:w-full tw:sm:w-auto'>
              <div className='tw:relative tw:flex tw:items-center'>
                <input
                  onChange={e => setSearch(e.target.value)}
                  value={search}
                  className='tw:w-full tw:sm:w-64 tw:pl-10 tw:border tw:border-gray-300 tw:text-gray-800 tw:rounded-lg tw:py-2 tw:pr-3 tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[var(--color-primary)] tw:focus:border-[var(--color-primary)]'
                  style={{ height: '40px' }}
                  type='search'
                  placeholder={searchPlaceholder || 'Search...'}
                />
                <button className='tw:absolute tw:inset-y-0 tw:left-0 tw:flex tw:items-center tw:pl-3'>
                  <i className='icon-search tw:text-xl tw:text-gray-500'></i>
                </button>
              </div>
            </div>
          )}

          {/* Children on right */}
          {childrenSide === 'right' && (
            <div className='tw:w-full tw:sm:w-auto'>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ControlPanel
