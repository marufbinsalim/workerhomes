import { useTranslations } from 'next-intl';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const TopHeaderFilter = ({ total, handAscDesc, handleDistanceAscDesc, sort }) => {
  const t = useTranslations('listings');

  return (
    <div className="tw:flex font-primary tw:justify-between tw:items-center tw:flex-wrap tw:w-full">
      {/* Left: Total Properties */}
      <div className="tw:text-[18px]">
        <span className="tw:font-semibold tw:text-[var(--color-primary)]">
          {total} {t('messages.properties')}
        </span>
      </div>

      {/* Right: Sorting Buttons */}
      <div className="tw:flex tw:gap-4 tw:mt-2 tw:sm:mt-0">
        {/* Sort by Distance */}
        <button
          onClick={handleDistanceAscDesc}
          className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:bg-[var(--color-primary)] tw:text-white tw:text-[14px] tw:font-semibold tw:min-w-[150px] tw:max-w-full tw:h-[40px] tw:py-[8px] tw:px-[16px] tw:whitespace-nowrap tw:rounded"
        >
          <span className="tw:truncate">{t('sorts.distance')}</span>
          {sort?.distance === 'asc' ? (
            <FaArrowUp className="tw:w-4 tw:h-4" />
          ) : (
            <FaArrowDown className="tw:w-4 tw:h-4" />
          )}
        </button>

        <button
          onClick={handAscDesc}
          className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:bg-[var(--color-primary)] tw:text-white tw:text-[14px] tw:font-semibold tw:min-w-[130px] tw:max-w-full tw:h-[40px] tw:py-[8px] tw:px-[16px] tw:whitespace-nowrap tw:rounded"
        >
          <span className="tw:truncate">{t('sorts.price')}</span>
          {sort?.price === 'asc' ? (
            <FaArrowUp className="tw:w-4 tw:h-4" />
          ) : (
            <FaArrowDown className="tw:w-4 tw:h-4" />
          )}
        </button>

      </div>
    </div>
  );
};

export default TopHeaderFilter;
