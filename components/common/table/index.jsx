import Link from "@/components/common/Link";
import { useTranslations } from "next-intl";

const Table = ({
  columns,
  data,
  onClick,
  isLoading = false,
  fullHeight = true,
  bordered = false,
  emptyState = null,
}) => {
  const t = useTranslations("listingsTable");

  const defaultEmptyState = (
    <div className="tw:h-full tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:p-8">
      <img
        src="/assets/invoiceNotFound.png" // Generic fallback image
        alt="No data"
        className="tw:w-[300px] tw:h-[300px] tw:object-contain"
      />
      <div className="tw:text-center font-secondary">
        <h3 className="tw:text-[24px] tw:font-medium tw:text-[var(--color-font-dark)] tw:mb-2">
          No Properties Listed Yet
        </h3>
        <p className="tw:text-[var(--color-font-regular)] tw:text-[16px] tw:font-normal">
          Your property listings will appear here once you create them. Get started by adding your first listing!
        </p>
      </div>
    </div>
  );

  return (
    <div className="tw:h-[90vh] tw:max-h-[100vh] tw:bg-white tw:overflow-auto tw:my-auto">
      {isLoading ? (
        <div className="tw:h-full tw:flex tw:items-center tw:justify-center">
          <div className="tw:p-4 tw:text-center tw:text-gray-500">
            {t("loading")}
          </div>
        </div>
      ) : data?.length <= 0 && !isLoading ? (
        emptyState || defaultEmptyState
      ) : (
        <table className="tw:w-full  font-secondary">
          <thead>
            <tr className="tw:border-b tw:border-[#D8E0ED]">
              {columns.map((column, index) => {
                return column.hidden ? null : (
                  <th
                    key={index}
                    colSpan={column.colSpan || 1}
                    className={`
                    tw:w-[1102px]
                    tw:h-[68px]
                    tw:p-[26px]
                    tw:bg-[#FAFBFC]
                    tw:font-normal
                    tw:text-[14px]
                    tw:text-[var(--color-font-regular)]
                    tw:border-b
                    tw:border-[#D8E0ED]
                    ${column.align === 'right' ? 'tw:text-right' : 'tw:text-left'}
                  `}
                  >
                    {column.Header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data?.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={onClick && (() => onClick(row))}
                className="
                tw:w-[1102px]
                tw:h-[152px]
                tw:gap-[30px]
                tw:bg-white
                tw:border-b
                tw:border-gray-200
                tw:hover:bg-gray-50
              "
              >
                {columns.map((column, colIndex) => {
                  const isActionColumn = column.align === "right";

                  return !column.hidden && (
                    <td
                      key={colIndex}
                      colSpan={column.colSpan || 1}
                      className={`
                      tw:p-[26px]
                      ${isActionColumn ? 'tw:text-right' : ''}
                    `}
                    >
                      <div className={isActionColumn ? 'tw:flex tw:justify-end' : ''}>
                        {column.accessor
                          ? typeof column.accessor === "function"
                            ? column.accessor(row)
                            : row[column.accessor]
                          : typeof column.Cell === "function"
                            ? column.Cell(row)
                            : row[column.id]}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
