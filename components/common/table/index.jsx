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
    <div className="tw:bg-green-500 tw:h-[90vh] tw:max-h-[100vh] tw:overflow-auto tw:my-auto">
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
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                rowSpan={4}
                className="tw:p-4 tw:text-center tw:text-gray-500"
              >
                {t("loading")}
              </td>
            </tr>
          ) : data?.length <= 0 && !isLoading ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                rowSpan={4}
                className="tw:p-4 tw:text-center tw:text-gray-500"
              >
                {t("no-data")}
              </td>
            </tr>
          ) : (
            data?.length > 0 &&
            !isLoading &&
            data?.map((row, rowIndex) => (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
