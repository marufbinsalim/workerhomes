'use client'

const ListFilter = ({ items, selected, onSelect }) => {
  return (
    <>
      <div className='d-flex flex-wrap align-items-center gap-2 mb-2'>
        {items?.map((item, index) => {
          if (item?.disabled) return null

          return (
            <button
              key={index}
              className={`filter-btn cursor-not-allowed ${
                item?.key === selected?.key ? 'filter-btn-selected' : ''
              }`}
              disabled={
                item?.hidden ||
                item?.disabled ||
                item?.item?.key === selected?.key
              }
              onClick={() => onSelect(item)}
            >
              {item?.value}
            </button>
          )
        })}
      </div>
    </>
  )
}

export default ListFilter
