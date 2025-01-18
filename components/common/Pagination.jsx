import { useTranslations } from 'next-intl'

const Pagination = ({
  totalPages,
  pageCount = 4,
  visiblePages = 5,
  currentPage,
  setCurrentPage,
}) => {
  const t = useTranslations('pagination')
  const handlePrevPage = () => {
    const prevPage = currentPage - 1
    setCurrentPage(Math.max(1, prevPage))
  }

  const handleNextPage = () => {
    const nextPage = currentPage + 1
    setCurrentPage(Math.min(pageCount, nextPage))
  }

  const handlePageClick = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const renderPagination = () => {
    const pages = []
    const start = Math.max(1, currentPage - Math.floor(visiblePages / 2))
    const end = Math.min(start + visiblePages - 1, pageCount)

    for (let i = start; i <= end; i++) {
      const className = `size-40 flex-center rounded-full cursor-pointer ${
        currentPage === i ? 'bg-dark-1 text-white' : ''
      }`

      pages.push(
        <div key={i} className='col-auto'>
          <button
            className={className}
            onClick={() => handlePageClick(i)}
            disabled={i === currentPage}
          >
            {i}
          </button>
        </div>
      )
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className='mt-30 '>
      <div className='row x-gap-10 y-gap-20 justify-center'>
        {pageCount > 1 && (
          <div className='col-auto md:order-1'>
            <button
              disabled={currentPage === 1}
              className={`button  ${
                currentPage === 1 ? '' : '-blue-1'
              } size-40 rounded-full border-light`}
              onClick={handlePrevPage}
            >
              <i className='icon-chevron-left text-12' />
            </button>
          </div>
        )}

        <div className='col-md-auto md:order-3'>
          {pageCount > 1 && (
            <div className='row x-gap-20 y-gap-20 items-center md:d-none'>
              {renderPagination()}
            </div>
          )}

          <div
            className={`text-center ${pageCount > 1 ? 'mt-30 md:mt-10' : ''}`}
          >
            <div className='text-14 text-light-1'>
              {currentPage} – {pageCount} {t('of')} {totalPages} {t('found')}
            </div>
          </div>
        </div>

        {pageCount > 1 && (
          <div className='col-auto md:order-2'>
            <button
              disabled={currentPage === pageCount}
              className={`button  ${
                currentPage === pageCount ? '' : '-blue-1'
              } size-40 rounded-full border-light`}
              onClick={handleNextPage}
            >
              <i className='icon-chevron-right text-12' />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pagination
