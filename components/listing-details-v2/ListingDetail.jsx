"use client";

import { exactPath } from "@/utils";
import { MapPin, Phone, Pin, Send } from "lucide-react";
import { useTranslations } from "next-intl";

function ImageGrid({ images }) {
  let imagesToShow = images ? [...images].slice(0, 4) : [];

  if (!imagesToShow || imagesToShow.length === 0) {
    return (
      <p className="tw:text-center tw:text-gray-500">No images available</p>
    );
  }

  if (imagesToShow.length === 1) {
    return (
      <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:flex-[80%]">
        <img
          src={imagesToShow[0]}
          alt="img-1"
          className="tw:w-full tw:h-[600px]  tw:object-cover"
        />
      </div>
    );
  }

  if (imagesToShow.length === 2) {
    return (
      <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:flex-[80%]">
        {imagesToShow.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`img-${index}`}
            className="tw:w-full tw:h-[600px]  tw:object-cover"
          />
        ))}
      </div>
    );
  }

  if (imagesToShow.length === 3) {
    return (
      <div className="tw:flex tw:gap-4 tw:h-[600px] tw:flex-[80%]">
        {/* Left: Large image */}
        <div className="tw:flex-[2] tw:h-full">
          <img
            src={imagesToShow[0]}
            alt="img-0"
            className="tw:w-full tw:h-full  tw:object-cover"
          />
        </div>

        {/* Right: Two stacked images */}
        <div className="tw:flex tw:flex-col tw:gap-4 tw:h-full">
          <div className="tw:h-[292px]">
            <img
              src={imagesToShow[1]}
              alt="img-1"
              className="tw:w-full tw:h-full  tw:object-cover"
            />
          </div>
          <div className="tw:h-[292px]">
            <img
              src={imagesToShow[2]}
              alt="img-2"
              className="tw:w-full tw:h-full  tw:object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  if (imagesToShow.length === 4) {
    return (
      <div className="tw:flex tw:gap-4 tw:h-[600px] tw:bg-red-200 tw:flex-[80%]">
        {/* Right stacked section */}
        <div className="tw:flex-[1] tw:flex tw:flex-col tw:gap-4">
          {/* Bottom wide image */}
          <div className="tw:h-[292px]">
            <img
              src={imagesToShow[1]}
              alt="img-3"
              className="tw:w-full tw:h-full  tw:object-cover"
            />
          </div>

          {/* Top row: 2 small images */}
          <div className="tw:flex tw:gap-4 tw:h-[292px]">
            <div className="tw:flex-1">
              <img
                src={imagesToShow[2]}
                alt="img-1"
                className="tw:w-full tw:h-full  tw:object-cover"
              />
            </div>
            <div className="tw:flex-1">
              <img
                src={imagesToShow[3]}
                alt="img-2"
                className="tw:w-full tw:h-full  tw:object-cover"
              />
            </div>
          </div>
        </div>
        {/* Left large image */}
        <div className="tw:flex-1 tw:h-full">
          <img
            src={imagesToShow[0]}
            alt="img-0"
            className="tw:w-full tw:h-full  tw:object-cover"
          />
        </div>
      </div>
    );
  }
}

export default function ListingDetail({ data, locale }) {
  console.log("ListingDetail", data, locale);
  const ht = useTranslations("header");

  function getFormatedLocationString(locations) {
    if (!locations || locations.length === 0) return "";
    let location = locations[0];
    let locationString = "";
    if (location?.street_one) locationString += `${location.street_one}`;
    if (location?.street_two) locationString += `, ${location.street_two}`;
    if (location?.city) locationString += ` ${location.city}`;
    if (location?.country) locationString += `, ${location.country}`;
    return locationString;
  }

  function extractThumbnailUrls(dataArray) {
    if (!dataArray || dataArray.length === 0) return [];
    let array = dataArray
      .map(
        (item) =>
          item.image?.url ||
          item.image?.formats?.medium?.url ||
          item.image?.formats?.small?.url ||
          item.image?.formats?.thumbnail?.url,
      )
      .filter(Boolean)
      .map((url) => {
        return exactPath(url);
      });
    return [...array];
  }

  function getFormattedLanguages(data) {
    let locale = data?.locale;
    let localizations = data?.localizations.map((loc) => loc.locale);
    let languages = [];
    if (locale) languages.push(locale);
    if (localizations) languages.push(...localizations);
    // Remove duplicates
    languages = [...new Set(languages)];
    languages = languages.map((lang) => {
      return ht(`locales.${lang}.language`);
    });
    return languages.join(", ");
  }

  return (
    <div className="tw:text-black tw:flex tw:flex-col tw:mt-[40px] tw:p-8 tw:py-20 tw:md:px-[60px] tw:md:py-[80px]">
      <h1 className="tw:font-semibold tw:text-[var(--color-font-dark)] tw:text-3xl">
        {data.title}
      </h1>
      <div className="tw:flex tw:gap-2">
        <MapPin size={20} className="tw:text-[var(--color-font-regular)]" />
        <p className="tw:text-[var(--color-font-regular)]">
          {getFormatedLocationString(data.location)}
        </p>
      </div>
      <div className="tw:flex tw:flex-col tw:md:flex-row tw:gap-5">
        <ImageGrid images={extractThumbnailUrls(data.galleries) || []} />
        <div className="tw:flex-[20%] tw:bg-[var(--color-white-light)] tw:p-7 tw:flex tw:flex-col tw:justify-between">
          <div className="tw:flex-1 tw:mb-6 tw:w-full">
            <img
              src={"/assets/blurmap.png"}
              alt="map"
              className="tw:w-full tw:object-cover tw:object-center"
            />
          </div>
          <div className="tw-flex tw:gap-4 tw:flex-col tw:mb-6">
            <p className="tw:font-semibold tw:text-[var(--color-font-dark)] tw:text-[18px]">
              Owner Details
            </p>
            <div className="tw:flex tw:gap-1 tw:flex-col">
              <p className="tw:text-[var(--color-font-dark)] tw:font-semibold tw:m-0">
                Owner :{" "}
                <span className="tw:font-normal tw:text-[var(--color-font-regular)]">
                  {data?.owner?.name}
                </span>
              </p>
              <p className="tw:text-[var(--color-font-dark)] tw:font-semibold tw:m-0">
                Languages :{" "}
                <span className="tw:font-normal tw:text-[var(--color-font-regular)]">
                  {getFormattedLanguages(data)}
                </span>
              </p>
            </div>
          </div>

          <div className="tw:flex tw:flex-col tw:gap-5">
            <button className="tw:flex tw:items-center tw:justify-center tw:border tw:border-[var(--color-brand-secondary)] tw:gap-2 tw:px-5 tw:py-2">
              <Phone
                size={20}
                className="tw:text-[var(--color-brand-secondary)]"
              />
              <p className="tw:text-[var(--color-brand-secondary)] m-0">Call</p>
            </button>
            <button className="tw:flex tw:items-center tw:justify-center tw:bg-[var(--color-primary)] tw:gap-2 tw:px-5 tw:py-2">
              <Send size={20} className="tw:text-white" />
              <p className="tw:text-white m-0">Message</p>
            </button>
          </div>
        </div>
      </div>
      {JSON.stringify(data)}
    </div>
  );
}
