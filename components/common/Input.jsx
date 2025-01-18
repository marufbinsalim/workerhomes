import { Icon } from '@iconify/react'
import { useField } from 'formik'

const Input = ({ label, type, ...props }) => {
  const [field, meta] = useField(props)
  const isError = meta.touched && meta.error

  const inputProps = {
    className: `${isError ? 'is-invalid' : ''}`,
    ...field,
    ...props,
  }

  const inputField =
    type === 'textarea' ? (
      <textarea {...inputProps} />
    ) : type === 'select' ? (
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
    )

  return (
    <div
      className={` ${
        isError ? 'has-error input-container' : 'input-container'
      }`}
    >
      <div className={`${type === 'select' ? 'form-select' : 'form-input'}`}>
        {type !== 'select' && inputField}
        {label && (
          <label
            className='lh-1 text-16 text-light-1 w-100 d-flex justify-content-between'
            htmlFor={props.id || props.name}
          >
            <span>
              {label}{' '}
              <span className='text-danger'>{props?.required && '*'}</span>
            </span>

            <Icon
              style={{
                pointerEvents: 'all',
              }}
              icon={props?.action?.icon}
              onClick={props?.action?.onClick}
              className='ml-10 pointer'
              width={20}
              height={20}
            />
          </label>
        )}
        {type === 'select' && inputField}
      </div>
      {isError && <div className='invalid-feedback'>{meta.error}</div>}
    </div>
  )
}

export default Input
