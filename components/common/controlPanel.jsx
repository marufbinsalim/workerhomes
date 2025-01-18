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
    <div className='row y-gap-20 justify-between align-items-center pb-20'>
      <div className='d-flex justify-content-between align-items-center'>
        <div>
          <h1 className='text-30 fw-600'>{title || 'Dashboard'}</h1>
          {description && <p>{description}</p>}
        </div>

        <div className='pt-3 px-3'>
          <Breadcrumbs />
        </div>
      </div>

      <div className='col-12 row  d-flex justify-content-between align-items-start'>
        <div className='col-8'>
          <div className='col-2 mb-30'>
            {actions &&
              actions?.map((action, index) => {
                if (!action?.hidden) {
                  return action?.href ? (
                    <Link
                      href={action?.href}
                      className='button -sm -dark-1 bg-blue-1 text-white  col-auto'
                      key={index}
                    >
                      {action?.label}
                    </Link>
                  ) : (
                    <button
                      key={index}
                      onClick={action?.onClick}
                      type={action?.type || 'button'}
                      className='button -sm -dark-1 bg-blue-1 text-white  col-auto'
                    >
                      {action?.label}
                    </button>
                  )
                } else {
                  return null
                }
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

        <div className='col-4 row gap-1 items-end justify-end '>
          {childrenSide === 'left' && children}

          {isSearchable && (
            <div className='col-auto'>
              <div className='single-field relative d-flex items-center md:d-none '>
                <input
                  onChange={e => setSearch(e.target.value)}
                  value={search}
                  className='pl-50 border-light text-dark-1 rounded-8'
                  style={{
                    height: '40px',
                  }}
                  type='search'
                  placeholder={searchPlaceholder || 'Search...'}
                />
                <button className='absolute d-flex items-center h-full'>
                  <i className='icon-search text-20 px-15 text-dark-1'></i>
                </button>
              </div>
            </div>
          )}

          {/* {actions &&
            actions?.map((action, index) => {
              if (!action?.hidden) {
                return action?.href ? (
                  <Link
                    href={action?.href}
                    className='button -sm -dark-1 bg-blue-1 text-white  col-auto'
                    key={index}
                  >
                    {action?.label}
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={action?.onClick}
                    type={action?.type || 'button'}
                    className='button -sm -dark-1 bg-blue-1 text-white  col-auto'
                  >
                    {action?.label}
                  </button>
                )
              } else {
                return null
              }
            })} */}
          {children && childrenSide === 'right' && (
            <div className='col-auto'>
              {childrenSide === 'right' && children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
