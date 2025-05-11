import React from 'react';
import { HeartIcon, MapPin, BedDoubleIcon, Bath } from 'lucide-react';

const ListingCard = ({ listing, toggleFavorite, isFavorite }) => {
    return (
        <div className="tw:w-full tw:md:max-w-[413px] tw:h-auto tw:flex tw:flex-col tw:bg-white tw:shadow-lg tw:mt-6 tw:md:mt-2">
            <div className="tw:relative tw:w-full">
                <img
                    src={listing.image}
                    alt={listing.title}
                    className="tw:w-full tw:h-auto sm:h-[413px] tw:aspect-square tw:object-cover"
                />

                {/* Favorite Icon */}
                <div
                    onClick={() => toggleFavorite(listing.id)}
                    className="tw:absolute tw:top-4 tw:right-4 tw:cursor-pointer"
                >
                    <HeartIcon
                        className={`tw:w-6 tw:h-6 ${isFavorite ? 'tw:fill-[var(--color-primary)]' : 'tw:fill-none'
                            } tw:stroke-white tw:stroke-2`}
                    />
                </div>

                {/* Price */}
                <div className="tw:absolute tw:bottom-4 tw:right-4 tw:bg-white tw:w-[140px] sm:w-[165px] tw:h-[40px] sm:h-[46px] tw:flex tw:items-center tw:justify-center tw:gap-[10px] tw:p-[10px]">
                    <span className="tw:font-semibold tw:text-[16px] sm:text-[18px]">{listing.price}</span>
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
                <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:text-gray-600">
                    <BedDoubleIcon className="tw:text-[var(--color-font-light)]" />
                    <span className="tw:text-[var(--color-font-light)] tw:font-normal tw:text-[14px] sm:text-[16px]">
                        {listing.features}
                    </span>
                    <span className="tw:text-[20px] sm:text-[24px] tw:text-[var(--color-font-regular)]">•</span>
                    <Bath className="tw:text-[var(--color-font-light)]" />
                    <span className="tw:text-[var(--color-font-light)] tw:font-normal tw:text-[14px] sm:text-[16px]">
                        {listing.thumbs}
                    </span>
                </div>
            </div>
        </div>

    );
};

export default ListingCard;
