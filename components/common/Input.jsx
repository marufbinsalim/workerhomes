import { Icon } from "@iconify/react";
import { useField } from "formik";

const Input = ({ label, type, ...props }) => {
  const [field, meta] = useField(props);
  const isError = meta.touched && meta.error;

  const inputProps = {
    className: `tw:w-full tw:rounded tw:border tw:p-2 tw:text-base tw:outline-none tw:focus:border-blue-500 tw:focus:ring-1 tw:focus:ring-blue-500 ${
      isError ? "tw:border-red-500" : "tw:border-gray-300"
    }`,
    ...field,
    ...props,
  };

  const inputField =
    type === "textarea" ? (
      <textarea {...inputProps} />
    ) : type === "select" ? (
      <select {...inputProps}>
        {props?.options?.map((option, index) => (
          <option
            key={index}
            value={option.value}
            selected={option?.selected}
            disabled={option?.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input type={type} {...inputProps} />
    );

  return (
    <div className="tw:mb-4">
      {label && (
        <label
          className="tw:mb-1 tw:block tw:text-base tw:font-medium tw:text-gray-700"
          htmlFor={props.id || props.name}
        >
          {label}
          {props?.required && (
            <span className="tw:text-red-500 tw:ml-1">*</span>
          )}
          {props?.action?.icon && (
            <Icon
              style={{
                pointerEvents: "all",
              }}
              icon={props?.action?.icon}
              onClick={props?.action?.onClick}
              className="tw:ml-2 tw:inline tw:cursor-pointer"
              width={20}
              height={20}
            />
          )}
        </label>
      )}
      {inputField}
      {isError && (
        <div className="tw:mt-2 tw:text-sm tw:text-[#B7B7B7]">{meta.error}</div>
      )}
    </div>
  );
};

export default Input;
