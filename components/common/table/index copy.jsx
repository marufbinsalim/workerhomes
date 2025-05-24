import Link from '@/components/common/Link'
import { useTranslations } from 'next-intl'

const Table = ({
  columns,
  data,
  onClick,
  isLoading = false,
  fullHeight = true,
  bordered = false,
}) => {
  const t = useTranslations('table')
  return (
    <div
      className={`overflow-auto bg-white scroll-bar-1 ${
        bordered ? 'border rounded' : ''
      } ${fullHeight ? 'min-h-screen' : 'min-h-20'} $}`}
    >
      <table className='table-2 col-12'>
        <thead className='bg-light-2'>
          <tr>
            {columns.map((column, index) => {
              return column.hidden ? null : (
                <th key={index} colSpan={column.colSpan || 1}>
                  {column.Header}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                rowSpan={4}
                className='text-center'
              >
                {t('loading')}
              </td>
            </tr>
          ) : data?.length <= 0 && !isLoading ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                rowSpan={4}
                className='text-center'
              >
                {t('no-data')}
              </td>
            </tr>
          ) : (
            data?.length > 0 &&
            !isLoading &&
            data?.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={onClick && (() => onClick(row))}
                className='table-row'
              >
                {columns.map((column, colIndex) => {
                  return column.hidden ? null : (
                    <td key={colIndex} colSpan={column.colSpan || 1}>
                      {column.accessor
                        ? // Support JSX in accessor
                          typeof column.accessor === 'function'
                          ? column.accessor(row)
                          : row[column.accessor]
                        : // Support JSX in Cell
                        typeof column.Cell === 'function'
                        ? column.Cell(row)
                        : row[column.id]}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
