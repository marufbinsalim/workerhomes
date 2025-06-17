"use client";
import React from "react";
import { HeartIcon, MapPin, BedDoubleIcon, Bath } from "lucide-react";
import { exactPath } from "@/utils";
import { useRouter } from "next/navigation";

const ListingCard = ({ listing, toggleFavorite, isFavorite }) => {
  const router = useRouter();
  return (
    <div
      className="tw:w-full tw:max-w-[90dvw] tw:md:max-w-[413px] tw:h-auto tw:flex tw:flex-col tw:bg-white tw:shadow-lg tw:mt-6 tw:md:mt-2 tw:cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        router.push(`${listing.slug}`);
      }}
    >
      <div className="tw:relative tw:w-full">
        <img
          src={exactPath(listing.image)}
          alt={listing.title}
          className="tw:w-[90dvw] tw:h-auto sm:h-[413px] tw:aspect-square tw:object-cover tw:border-b tw:border-[#1b1b1b10]"
        />

        {/* Favorite Icon */}
        <div
          onClick={async (e) => {
            e.stopPropagation();
            await toggleFavorite(listing.id);
          }}
          className="tw:absolute tw:top-4 tw:right-4 tw:cursor-pointer tw:border tw:border-[#1b1b1b10] tw:rounded-md tw:p-[2px]"
        >
          <div className="tw:inline-flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-black/40 tw:rounded-full">
            <HeartIcon
              className={`tw:w-6 tw:h-6 ${
                isFavorite ? "tw:fill-[var(--color-primary)]" : "tw:fill-none"
              } tw:stroke-white tw:stroke-2`}
            />
          </div>
        </div>

        {/* Price */}
        <div className="tw:bg-white tw:border tw:border-[#1b1b1b20] tw:absolute tw:bottom-4 tw:right-4 tw:w-[140px] sm:w-[165px] tw:h-[40px] sm:h-[46px] tw:flex tw:items-center tw:justify-center tw:gap-[10px] tw:p-[10px]">
          <span className="tw:font-semibold tw:text-[16px] sm:text-[18px]">
            ${listing.price} / Per Night
          </span>
        </div>
      </div>

      <div className="tw:p-4 tw:flex tw:flex-col tw:gap-2">
        <h3 className="tw:text-[20px] sm:text-[24px] tw:font-semibold tw:text-[var(--color-font-dark)]">
          {listing.title}
        </h3>
        <div className="tw:flex tw:items-center tw:gap-2 tw:text-gray-600">
          <MapPin className="tw:text-[var(--color-font-regular)] tw:relative tw:-top-[3px]" />
          <span className="tw:font-medium tw:text-[16px] sm:text-[18px] tw:text-[var(--color-font-regular)]">
            {listing.location}
          </span>
        </div>
        <div className="tw:flex tw:flex-wrap tw:items-center tw:text-gray-600 tw:gap-4">
          {listing.features.map((feature, index) => (
            <div
              className="tw:flex tw:gap-4 tw:items-center "
              key={`${index}-${feature.title}`}
            >
              <div className="tw:flex tw:gap-2">
                <img
                  src={exactPath(feature.icon)}
                  alt={feature.title}
                  className="tw:w-5 tw:h-5"
                />

                <span
                  key={index}
                  className="tw:font-normal tw:text-[14px] sm:text-[16px] tw:text-[var(--color-font-light)]"
                >
                  {feature.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
