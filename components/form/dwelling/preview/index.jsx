"use client";

import { google_key } from "@/config";
import { exactPath } from "@/utils";
import {
  ChevronLeft,
  MapPin,
  XIcon,
  HeartIcon,
  Phone,
  Send,
  Share2,
  StarIcon,
} from "lucide-react";
import MapComponent from "@/components/common/MapComponent";
import { useTranslations } from "next-intl";
import GenericModal from "./GenericModal";
import { useRef, useState } from "react";
import ImageSlider from "./imageSlider";
import { useRouter } from "next/navigation";
import RatingTag from "@/components/hotel-single/RatingTag";
import PricingCard from "@/components/common/card/price-card";
const PLATINUM = "/Uploads/platinum_abbff594d3.png";
const GOLD = "/Uploads/gold_d483a49301.png";
const SILVER = "/Uploads/silver_387507de92.png";
const FREE = "/Uploads/home_e14afd668e.png";

function ImageGrid({ images, setOpen }) {
  let imagesToShow = images ? [...images].slice(0, 1) : [];

  if (!imagesToShow || imagesToShow.length === 0) {
    return (
      <p className="tw:text-center font-primary tw:text-gray-500">
        No images available
      </p>
    );
  }

  if (imagesToShow.length === 1) {
    return (
      <div
        className="tw:grid tw:grid-cols-1 tw:gap-4 tw:flex-[80%]"
        onClick={() => setOpen(true)}
      >
        <img
          src={imagesToShow[0]}
          alt="img-1"
          className="tw:w-full tw:h-[600px] tw:object-cover"
        />
      </div>
    );
  }

  if (imagesToShow.length === 2) {
    return (
      <div
        className="tw:grid tw:grid-cols-2 tw:gap-4 tw:flex-[80%]"
        onClick={() => setOpen(true)}
      >
        {imagesToShow.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`img-${index}`}
            className="tw:w-full tw:h-[600px] tw:object-cover"
          />
        ))}
      </div>
    );
  }

  if (imagesToShow.length === 3) {
    return (
      <div
        className="tw:flex tw:gap-4 tw:h-[600px] tw:flex-[80%]"
        onClick={() => setOpen(true)}
      >
        <div className="tw:flex-[2] tw:h-full">
          <img
            src={imagesToShow[0]}
            alt="img-0"
            className="tw:w-full tw:h-full tw:object-cover"
          />
        </div>
        <div className="tw:flex tw:flex-col tw:gap-4 tw:h-full">
          <div className="tw:h-[292px]">
            <img
              src={imagesToShow[1]}
              alt="img-1"
              className="tw:w-full tw:h-full tw:object-cover"
            />
          </div>
          <div className="tw:h-[292px]">
            <img
              src={imagesToShow[2]}
              alt="img-2"
              className="tw:w-full tw:h-full tw:object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  if (imagesToShow.length === 4) {
    return (
      <div
        className="tw:flex tw:gap-4 tw:h-[600px] tw:flex-[80%]"
        onClick={() => setOpen(true)}
      >
        <div className="tw:flex-[1] tw:flex tw:flex-col tw:gap-4">
          <div className="tw:h-[292px]">
            <img
              src={imagesToShow[1]}
              alt="img-3"
              className="tw:w-full tw:h-full tw:object-cover"
            />
          </div>
          <div className="tw:flex tw:gap-4 tw:h-[292px]">
            <div className="tw:flex-1">
              <img
                src={imagesToShow[2]}
                alt="img-1"
                className="tw:w-full tw:h-full tw:object-cover"
              />
            </div>
            <div className="tw:flex-1">
              <img
                src={imagesToShow[3]}
                alt="img-2"
                className="tw:w-full tw:h-full tw:object-cover"
              />
            </div>
          </div>
        </div>
        <div className="tw:flex-1 tw:h-full">
          <img
            src={imagesToShow[0]}
            alt="img-0"
            className="tw:w-full tw:h-full tw:object-cover"
          />
        </div>
      </div>
    );
  }
}

const PreviewDwelling = ({ data, locale }) => {
  if (!data) return null;
  const t = useTranslations("heroSection");
  const ht = useTranslations("header");

  const router = useRouter();

  const overviewRef = useRef();
  const pricingRef = useRef();
  const locationRef = useRef();
  const [isImageSliderOpen, setIsImageSliderOpen] = useState(false);
  const [isShowDescriptionOpen, setIsShowDescriptionOpen] = useState(false);
  const [isShowFeaturesOpen, setIsShowFeaturesOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState("overview");

  const location = data?.location?.[0];
  const icon =
    data?.subscription?.package?.name === "Platinum"
      ? { url: PLATINUM, size: [42, 42] }
      : data?.subscription?.package?.name === "Gold"
      ? { url: GOLD, size: [35, 35] }
      : data?.subscription?.package?.name === "Silver"
      ? { url: SILVER, size: [28, 28] }
      : { url: FREE, size: [24, 24] };

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

  function extractThumbnailUrls(dataArray) {
    if (!dataArray || dataArray.length === 0) return [];
    let array = dataArray
      .map(
        (item) =>
          item.image?.url ||
          item.image?.formats?.medium?.url ||
          item.image?.formats?.small?.url ||
          item.image?.formats?.thumbnail?.url
      )
      .filter(Boolean)
      .map((url) => exactPath(url));
    return [...array];
  }

  const formattedFeatures = data?.features.map((f) => ({
    title: f.title,
    icon: f.icon?.url || "",
    type: "feature",
  }));

  const formattedAmenities = data?.amenities.map((f) => ({
    title: f.title,
    icon: f.icon?.url || "",
    type: "amenity",
  }));

  return (
    <div className="tw:text-black tw:flex tw:flex-col font-primary tw:p-8 tw:md:px-[60px]">
      <div
        className="tw:flex tw:cursor-pointer tw:items-center tw:gap-1 tw:py-2"
        onClick={() => router.push(`/${locale}/listings`)}
      ></div>
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
        <div className="tw:flex tw:gap-4">
          <button
            className={`tw:font-medium tw:text-sm tw:px-4 tw:py-2 ${
              selectedButton === "overview"
                ? "tw:border-b-2 tw:border-[var(--color-brand-secondary)] tw:bg-[var(--color-brand-secondary)] tw:text-white"
                : "border"
            }`}
            onClick={() => {
              setSelectedButton("overview");
              overviewRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }}
          >
            Overview
          </button>
          <button
            className={`tw:font-medium tw:text-sm tw:px-4 tw:py-1 tw:flex tw:items-center ${
              selectedButton === "features"
                ? "tw:border-b-2 tw:border-[var(--color-brand-secondary)] tw:bg-[var(--color-brand-secondary)] tw:text-white"
                : "border"
            }`}
            onClick={() => {
              setSelectedButton("features");
              pricingRef?.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }}
          >
            Prices & Conditions
          </button>
          <button
            className={`tw:font-medium tw:text-sm tw:px-4 tw:py-1 tw:flex tw:items-center ${
              selectedButton === "location"
                ? "tw:border-b-2 tw:border-[var(--color-brand-secondary)] tw:bg-[var(--color-brand-secondary)] tw:text-white"
                : "border"
            }`}
            onClick={() => {
              setSelectedButton("location");
              locationRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }}
          >
            Location
          </button>
        </div>
        {data?.isRecommended && <RatingTag />}
      </div>
      <div className="tw:flex tw:flex-col tw:mb-4">
        <div className="tw:flex tw:items-center tw:gap-2">
          <h1 className="tw:font-semibold tw:text-[var(--color-font-dark)] tw:text-[28px]">
            {data.title}
          </h1>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          <img
            src={exactPath(icon.url)}
            alt={data?.subscription?.package?.name}
            className="tw:w-[24px] tw:h-[24px]"
          />
        </div>
        <div className="tw:flex tw:gap-2 tw:items-center">
          <MapPin
            size={24}
            className="tw:text-[var(--color-font-regular)] tw:mb-4"
          />
          <p className="tw:text-[var(--color-font-regular)] tw:text-[20px] tw:font-normal">
            {getFormatedLocationString(data.location)}
          </p>
        </div>
      </div>
      <div className="tw:flex tw:flex-col tw:md:flex-row tw:gap-5">
        <ImageGrid
          images={extractThumbnailUrls(data.galleries) || []}
          setOpen={setIsImageSliderOpen}
        />
        <GenericModal isOpen={isImageSliderOpen} setOpen={setIsImageSliderOpen}>
          <ImageSlider imageUrls={extractThumbnailUrls(data.galleries) || []} />
        </GenericModal>
        <div className="tw:flex-[40%] tw:bg-[var(--color-white-light)] tw:p-7 tw:flex tw:flex-col">
          <div className="tw:mb-6 tw:w-full">
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
        </div>
      </div>
      <div
        className="tw:flex tw:flex-col tw:md:flex-row tw:gap-4 tw:mt-8 tw:md:max-h-[350px] tw:max-w-dvw"
        ref={overviewRef}
      >
        <div className="tw:flex-3/5 tw:relative">
          <h2 className="tw:text-[24px] tw:font-bold tw:text-left tw:text-[var(--color-font-dark)] tw:w-full">
            Property Overview
          </h2>
          <p className="tw:md:max-w-[80%] tw:line-clamp-6 tw:text-[16px] tw:text-[#797979] tw:font-normal tw:text-justify">
            {data.description?.replace(/<\/?[^>]+(>|$)/g, "") ||
              "No description available for this property."}
          </p>
          <div className="fade-true tw:w-full tw:md:max-w-[80%] tw:absolute tw:bottom-0 p-4 tw:flex tw:items-center tw:justify-center tw:z-30">
            <button
              className="tw:bg-[#040342] tw:text-white tw:text-[14px] tw:font-semibold tw:py-2 tw:px-4"
              onClick={() => setIsShowDescriptionOpen(true)}
            >
              Read More
            </button>
          </div>
        </div>
        <div className="tw:flex-2/5">
          <h2 className="tw:text-[24px] tw:font-semibold tw:text-left tw:text-[var(--color-font-dark)] tw:w-full">
            Features & Amenities
          </h2>
          <div className="tw:relative tw:grid tw:grid-cols-2 tw:gap-4">
            {[...formattedFeatures, ...formattedAmenities]
              .slice(0, 10)
              .map((f, idx) => (
                <div className="tw:flex tw:gap-2" key={idx}>
                  <div className="tw:flex tw:gap-2">
                    {f.type !== "feature" ? (
                      <StarIcon
                        size={24}
                        className="tw:text-[var(--color-font-light)]"
                      />
                    ) : (
                      <img
                        src={exactPath(f.icon)}
                        alt={f.title}
                        className="tw:w-5 tw:h-5 tw:filter tw:brightness-0 tw:opacity-50"
                      />
                    )}

                    <span className="tw:font-normal tw:text-[14px] tw:sm:text-[16px] tw:text-[var(--color-font-regular)]">
                      {f.title}
                    </span>
                  </div>
                </div>
              ))}
            <div className="fade-true tw:w-full tw:absolute tw:bottom-0 tw:flex tw:items-center tw:justify-center tw:z-30 tw:h-[20px]"></div>
          </div>

          <div className="tw:w-full tw:flex tw:items-center tw:justify-center tw:mt-6 tw:max-w-[80%]">
            <button
              className="tw:bg-[#040342] tw:text-[14px] tw:font-semibold tw:text-white tw:py-2 tw:px-4"
              onClick={() => {
                setIsShowFeaturesOpen(true);
              }}
            >
              Show More Amenities & Features
            </button>
          </div>
        </div>
      </div>
      <GenericModal
        setOpen={setIsShowDescriptionOpen}
        isOpen={isShowDescriptionOpen}
      >
        <div className="tw:bg-white tw:max-w-[40dvw] tw:rounded-2xl">
          <div className="tw:flex tw:justify-between tw:bg-[#FAFBFC] tw:p-4 tw:rounded-2xl">
            <h2 className="tw:text-2xl tw:font-bold tw:text-left tw:text-[var(--color-font-dark)] tw:w-full">
              Property Overview
            </h2>
            <XIcon
              size={24}
              onClick={() => setIsShowDescriptionOpen(false)}
              className="tw:cursor-pointer"
            />
          </div>
          <div className="tw:p-4 tw:max-h-[60dvh] tw:overflow-y-auto">
            <p className="tw:text-justify">
              {data.description?.replace(/<\/?[^>]+(>|$)/g, "") ||
                "No description available for this property."}
            </p>
          </div>
        </div>
      </GenericModal>
      <GenericModal isOpen={isShowFeaturesOpen} setOpen={setIsShowFeaturesOpen}>
        <div className="tw:bg-white tw:min-w-[40dvw] tw:max-w-[40dvw] tw:rounded-2xl">
          <div className="tw:flex tw:justify-between tw:bg-[#FAFBFC] tw:p-4 tw:rounded-2xl">
            <h2 className="tw:text-2xl tw:font-bold tw:text-left tw:text-[var(--color-font-dark)] tw:w-full">
              Amenities
            </h2>
            <XIcon
              size={24}
              onClick={() => setIsShowFeaturesOpen(false)}
              className="tw:cursor-pointer"
            />
          </div>
          <div className="tw:p-4 tw:max-h-[60dvh] tw:overflow-y-auto">
            {[...formattedFeatures, ...formattedAmenities].map((f, idx) => (
              <div className="tw:flex tw:gap-2 tw:mb-2" key={idx}>
                {f.type !== "feature" ? (
                  <StarIcon
                    size={24}
                    className="tw:text-[var(--color-font-light)]"
                  />
                ) : (
                  <img
                    src={exactPath(f.icon)}
                    alt={f.title}
                    className="tw:w-5 tw:h-5"
                  />
                )}
                <p className="tw:font-normal tw:text-[14px] sm:tw:text-[16px] tw:text-[var(--color-font-light)]">
                  {f.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </GenericModal>

      {data?.prices?.length > 0 && (
        <section className="tw:pt-12 tw:pb-20" ref={pricingRef}>
          <div className="mx-auto">
            <div className="tw:flex tw:flex-col tw:items-center">
              <h2 className="tw:text-[24px] tw:font-semibold tw:text-left tw:text-[var(--color-font-dark)] tw:w-full">
                Prices & Conditions
              </h2>
            </div>
            <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-4 tw:gap-6">
              {data?.prices.map((p, idx) => (
                <div
                  key={idx}
                  className="tw:bg-[#FAFBFC] tw:border tw:border-[#D8E0ED] tw:p-4"
                >
                  <p className="tw:font-semibold tw:text-[#FF780B]">
                    <span className="tw:text-[24px]">${p.amount} </span>
                    <span className="tw:text-[18px]">
                      / {p.total ? `${p.total} X ${p.type}` : p.type}
                    </span>
                  </p>
                  <p className="tw:text-[14px] tw:font-normal tw:mt-2 tw:text-[#797979]">
                    Number of Guests:{" "}
                    <span className="tw:font-medium tw:text-[#3B3B3B]">
                      {p.guest}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div
        className="tw:w-full tw:h-[300px] tw:md:h-[600px] tw:rounded-[10px] tw:overflow-hidden"
        ref={locationRef}
      >
        <h2 className="tw:text-[24px] tw:font-semibold tw:text-left tw:text-[var(--color-font-dark)] tw:w-full">
          Location
        </h2>
        <MapComponent
          defaultCenter={data?.location[0]?.geo}
          setLocations={() => {}}
          locations={[]}
          apiKey={google_key}
          zoom={11}
          locale={locale}
          search={false}
        />
      </div>
    </div>
  );
};

export default PreviewDwelling;
