import Link from "@/components/common/Link";
import { useTranslations } from "next-intl";

const Table = ({
  columns,
  data,
  onClick,
  isLoading = false,
  fullHeight = true,
  bordered = false,
}) => {
  const t = useTranslations("table");
  return (
    <div className="tw:h-[90vh] tw:max-h-[100vh] tw:bg-white tw:overflow-auto tw:my-auto">
      {isLoading ? (
        <div className="tw:h-full tw:flex tw:items-center tw:justify-center">
          <div className="tw:p-4 tw:text-center tw:text-gray-500">
            {t("loading")}
          </div>
        </div>
      ) : data?.length <= 0 && !isLoading ? (
        <div className="tw:h-full tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:p-8">
          <img
            src="/assets/invoiceNotFound.png"
            alt="No invoices"
            className="tw:w-[300px] tw:h-[300px] tw:object-contain"
          />
            <div className="tw:text-center font-secondary ">
              <h3 className="tw:text-[24px] tw:font-medium tw:text-[var(--color-font-dark)] tw:mb-2">
              No invoice found
            </h3>
              <p className="tw:text-[var(--color-font-regular)] tw:text-[16px] tw:font-normal">
              Your invoice list is currently empty. Once invoices are generated, they'll appear here.
            </p>
          </div>
        </div>
      ) : (
        <table className="tw:w-full">
          <thead className="tw:bg-gray-50">
            <tr>
              {columns.map((column, index) => {
                return column.hidden ? null : (
                  <th
                    key={index}
                    colSpan={column.colSpan || 1}
                    className="tw:p-3 tw:text-left tw:font-medium tw:text-gray-700"
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
                className="tw:hover:bg-gray-50 tw:border-t tw:border-gray-100"
              >
                {columns.map((column, colIndex) => {
                  return column.hidden ? null : (
                    <td
                      key={colIndex}
                      colSpan={column.colSpan || 1}
                      className="tw:p-3 tw:text-gray-600"
                    >
                      {column.accessor
                        ? typeof column.accessor === "function"
                          ? column.accessor(row)
                          : row[column.accessor]
                        : typeof column.Cell === "function"
                          ? column.Cell(row)
                          : row[column.id]}
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
