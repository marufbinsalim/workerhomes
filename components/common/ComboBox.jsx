import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { Icon } from "@iconify/react";

const ComboBox = ({
  label,
  name,
  url,
  onChange,
  error,
  placeholder,
  locale = "en",
  value,
  keyValue,
  extraKeys = [],
  multiple = false,
  params,
  isRole = false,
  required = false,
  setTouched,
  selectedFirstItem = false,
  symbol,
  ...rest
}) => {
  const [changed, setChanged] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const buildNestedFilter = (keyPath, value) => {
    const keys = keyPath.split(".");
    return keys.reduceRight((acc, key) => ({ [key]: acc }), {
      $containsi: value,
    });
  };

  const {
    data: MainData,
    isLoading,
    reFetch,
  } = useFetch({
    url,
    keys: [locale],
    query: {
      ...params,
      filters: {
        ...params?.filters,
        ...buildNestedFilter(keyValue, searchTerm || undefined),
      },
      locale,
      sort: ["id:desc"],
    },
  });

  const data = isRole ? MainData?.roles : MainData;

  useEffect(() => {
    if (value) {
      setSearchTerm(getNestedValue(value, keyValue) ?? "");
    }
  }, [value]);

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const handleItemClick = (item) => {
    if (multiple) {
      // Handle multiple selection logic here if needed
    } else {
      if (item?.id === value?.id) {
        onChange(null);
        setSearchTerm("");
      } else {
        onChange(item);
        setSearchTerm(getNestedValue(item, keyValue));
      }
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (selectedFirstItem && data) {
      onChange(data?.[0]);
    }
  }, [selectedFirstItem, data]);

  return (
    <div className="tw:mb-4 tw:w-full">
      <div className={`tw:rounded tw:bg-white tw:w-full`}>
        <label
          className="tw:mb-1 tw:block tw:text-base tw:font-medium tw:text-gray-700"
          htmlFor={name}
        >
          {label}
          {required && <span className="tw:text-red-500 tw:ml-1">*</span>}
        </label>
        <div className="tw:relative">
          <input
            type="text"
            id={name}
            name={name}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
              setChanged(true);
            }}
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                onChange(null);
                setTouched && setTouched({ [name]: true });
              }
              setTimeout(() => setIsDropdownOpen(false), 200);
            }}
            value={searchTerm}
            required={required}
            placeholder={placeholder ?? "Select an item"}
            className="tw:w-full tw:capitalize tw:rounded tw:border tw:border-gray-300 tw:p-2 tw:text-base tw:outline-none tw:focus:border-blue-500 tw:focus:ring-1 tw:focus:ring-blue-500"
            {...rest}
          />
          {isDropdownOpen && (
            <div className="tw:absolute tw:z-10 tw:mt-1 tw:w-full tw:max-h-60 tw:overflow-y-auto tw:rounded tw:border tw:border-gray-300 tw:bg-white tw:shadow-lg">
              {data?.length <= 0 ? (
                <div className="tw:cursor-not-allowed tw:p-3 tw:text-gray-500">
                  No Items | Search for something
                </div>
              ) : data?.length > 0 && !isLoading ? (
                data?.map((item, index) => (
                  <div
                    key={index}
                    className={`tw:capitalize tw:cursor-pointer tw:p-3 tw:hover:bg-gray-100 ${
                      item?.id === value?.id ? "tw:bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      handleItemClick(item);
                      setChanged(true);
                    }}
                  >
                    <span>
                      {getNestedValue(item, keyValue)}{" "}
                      {extraKeys.map((key, i) => (
                        <span key={i}>
                          <Icon icon="radix-icons:dot" className="tw:inline" />
                          {getNestedValue(item, key)
                            ? `${symbol} ${getNestedValue(item, key)}`
                            : "Unlimited"}
                        </span>
                      ))}
                    </span>
                    {item?.id === value?.id && (
                      <Icon
                        icon="charm:cross"
                        className="tw:ml-2 tw:inline tw:text-red-500"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="tw:p-3 tw:text-gray-500">Loading...</div>
              )}
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="tw:mt-2 tw:text-sm tw:text-[#B7B7B7]">{error}</div>
      )}
    </div>
  );
};

export default ComboBox;
