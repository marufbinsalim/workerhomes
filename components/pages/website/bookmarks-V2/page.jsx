"use client";
import React, { useEffect, useState } from 'react';
import { useBookmarks } from '@/context/BookmarkProvider'
import { useTranslations } from 'next-intl';
import HotelProperties from '@/components/hotel-list/hotel-list-v3/HotelProperties'
import { HeartIcon } from 'lucide-react';

const BookmarkPage = () => {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const { isBookmarked: isBookmarkedInDB, items } = useBookmarks();
  const t = useTranslations('bookmark');

  const isLoading = false; // explicitly define it for now
  const data = items?.data?.map(item => item.dwelling) || [];

  const isBookmarked = (id) => {
    if (isLoading || !id) return false;
    return isBookmarkedInDB(id);
  };

  useEffect(() => {
    if (!isLoading && data.length > 0) {
      const count = data.filter(item => isBookmarked(item.id)).length;
      setFavoriteCount(count);
    }
  }, [data, isLoading]);

  return (
    <section className="tw:py-20 tw:sm:py-20 tw:mt-4 font-primary tw:bg-white">
      <div className="tw:px-4 tw:sm:px-30 tw:mx-auto">
        {/* Header Section */}
        <div className="tw:flex tw:flex-col tw:mb-8 tw:items-center tw:px-2">
          <div className="tw:w-full tw:sm:w-[650px] tw:h-auto tw:flex tw:items-center tw:justify-center">
            <h1 className="tw:font-semibold tw:text-[24px] tw:sm:text-[32px] tw:md:text-[48px] tw:text-[var(--color-font-dark)] tw:tracking-normal tw:text-center">
              {t('title')}
            </h1>
          </div>
          <p className="tw:w-full tw:sm:w-[400px] tw:text-[14px] tw:sm:text-[16px] tw:font-normal tw:text-[var(--color-font-regular)] tw:text-center">
            {t('description')}
          </p>
        </div>

        {data.length > 0 ? (
          <div className="tw:grid tw:gap-6 tw:md:gap-2">
            {/* Bookmark Title Section */}
            <div className="tw:text-start tw:mx-auto tw:w-full">
              <h1 className="tw:text-[20px] tw:sm:text-[24px] tw:md:text-[32px] tw:font-semibold tw:text-[var(--color-font-dark)]">
                {t('bookmarks')}
              </h1>
              <p className="tw:flex tw:mt-2 tw:text-[14px] tw:sm:text-[16px] tw:items-center tw:gap-2 tw:font-normal tw:text-[var(--color-font-regular)]">
                <HeartIcon className="tw:fill-[var(--color-red)] tw:w-5 tw:h-5 tw:stroke-none" />
                {favoriteCount} {t('subtitle')}
              </p>
            </div>

            {/* Property Cards */}
            <HotelProperties data={data} isLoading={isLoading} />
          </div>
        ) : (
          <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16 tw:sm:py-20 tw:text-center tw:px-4">
            <h6 className="tw:text-base tw:sm:text-lg tw:font-semibold tw:mb-2">
              {t('message.empty')}
            </h6>
            <p className="tw:text-[var(--color-font-regular)]">
              {t('message.empty2')}
            </p>
          </div>
        )}
      </div>
    </section>


  );
};

export default BookmarkPage;
