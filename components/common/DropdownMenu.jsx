// import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import Link from './Link';

const DropdownMenu = ({ options, label, side = 'left', trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="tw:relative font-secondary" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="tw:flex tw:items-center tw:justify-center tw:p-2 tw:rounded-full hover:tw:bg-gray-100"
      >
        {trigger || (
          label ? (
            <span className="tw:py-1 tw:px-4 tw:rounded tw:bg-blue-600 tw:text-white">
              {label}
            </span>
          ) : (
            <Icon icon="charm:menu-kebab" className="tw:text-gray-500 hover:tw:text-gray-700" />
          )
        )}
      </button>

      {isOpen && (
        <div className="
         tw:absolute tw:z-50 tw:mt-2 tw:py-1 tw:w-48 tw:bg-white
         tw:rounded-sm tw:shadow-md 
         tw:right-0
       ">
          {options.map((option) => {
            if (option?.disabled) return null;

            const commonProps = {
              key: option.value,
              className: `
          tw:flex tw:items-center tw:w-full tw:px-4 tw:py-2 tw:text-sm
          tw:text-[var(--color-font-dark)] tw:font-normal
          ${option.divider ? 'tw:border-t tw:border-orange-500 tw:mt-1' : ''}
        `,
              onClick: () => {
                option?.onClick?.();
                setIsOpen(false);
              }
            };

            return option?.href ? (
              <Link {...commonProps} href={option.href}>
                {option.icon && <span className="tw:mr-2">{option.icon}</span>}
                {option.label}
              </Link>
            ) : (
              <button {...commonProps} disabled={option.disabled}>
                {option.icon && <span className="tw:mr-2">{option.icon}</span>}
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
