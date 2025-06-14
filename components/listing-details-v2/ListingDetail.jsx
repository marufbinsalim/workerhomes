"use client";

import { google_key } from "@/config";
import { exactPath } from "@/utils";
import {
  ChevronLeft,
  HeartIcon,
  MapPin,
  Phone,
  Send,
  Share2,
  XIcon,
} from "lucide-react";
import MapComponent from "@/components/common/MapComponent";
import { useTranslations } from "next-intl";
import GenericModal from "./GenericModal";
import { useRef, useState } from "react";
import ImageSlider from "./imageSlider";
import PricingCard from "../common/card/price-card";
import useFeatured from "@/hooks/useFeatured";
import ListingCard from "../dashboard-v2/ListingCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { showToast } from "../toast/Toast";
import { useBookmarks } from "@/context/BookmarkProvider";
import ContactButton from "../common/ContactButton";
import ContactForm from "../form/dwelling/contact/contactForm-V2";
import Facilities from "../cruise-single/Facilities";
import { useRouter } from "next/navigation";

function ImageGrid({ images, setOpen }) {
  let imagesToShow = images ? [...images].slice(0, 4) : [];

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
          className="tw:w-full tw:h-[600px]  tw:object-cover"
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
            className="tw:w-full tw:h-[600px]  tw:object-cover"
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
      <div
        className="tw:flex tw:gap-4 tw:h-[600px] tw:bg-red-200 tw:flex-[80%]"
        onClick={() => setOpen(true)}
      >
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

export default function ListingDetail({ data, locale, session }) {
  console.log("ListingDetail", data, locale);
  const ht = useTranslations("header");

  const router = useRouter();

  const overviewRef = useRef();
  const pricingRef = useRef();
  const locationRef = useRef();
  const [isImageSliderOpen, setIsImageSliderOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isShowDescriptionOpen, setIsShowDescriptionOpen] = useState(false);
  const [isShowFeaturesOpen, setIsShowFeaturesOpen] = useState(false);
  const { featuredListings, featuredListingsError, featuredListingsLoading } =
    useFeatured(locale);
  const [isBookmarkedItem, setIsBookmarkedItem] = useState(false);
  const [selectedButton, setSelectedButton] = useState("default");

  const {
    toggleBookmark,
    isBookmarked: isBookmarkedInDB,
    isLoading,
  } = useBookmarks();

  const isBookmarked = (id) => {
    if (isLoading) return false; // Return false if loading
    if (!id) return false; // Return false if id is not provided

    let isListingBookmarked = isBookmarkedInDB(id);
    console.log("listing id", id);
    console.log("isBookmarked", isListingBookmarked);
    return isListingBookmarked ? true : false;
  };

  const t = useTranslations("heroSection");

  const toggleFavorite = async (id) => {
    if (!session?.id) {
      showToast("info", t("toast.favoriteInfo"));
      return;
    }

    try {
      await toggleBookmark(id, session.id); // Call the toggle

      // Refresh actual bookmark state
      const isNowBookmarked = isBookmarked(id);
      setIsBookmarkedItem(isNowBookmarked);

      showToast(
        "success",
        isNowBookmarked ? t("toast.favoriteRemoved") : t("toast.favoriteAdded")
      );
    } catch (err) {
      showToast("error", t("toast.favoriteError"));
    }
  };

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
          item.image?.formats?.thumbnail?.url
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

  const formattedFeatures = data?.features.map((f) => ({
    title: f.title,
    icon: f.icon?.url || "",
  }));

  const formattedAmenities = data?.amenities.map((f) => ({
    title: f.title,
    icon: f.icon?.url || "",
  }));

  const shouldShowReadMore = (description) => {
    if (!description) return false;
    const cleanDescription = description.replace(/<\/?[^>]+(>|$)/g, "");
    return cleanDescription.length > 400;
  };

  return (
    <div className="tw:text-black tw:flex tw:flex-col tw:mt-[40px] font-primary tw:p-8 tw:py-20 tw:md:px-[60px] tw:md:py-[80px]">
      <div
        className="tw:flex tw:cursor-pointer tw:items-center tw:gap-1 tw:py-2"
        onClick={() => {
          router.push(`/${locale}/listings`);
        }}
      >
        <ChevronLeft
          size={24}
          color="#FF780B"
          className="tw:cursor-pointer tw:mb-4"
        />
        <p className="tw:text-[#FF780B] tw:text-[14px] tw:font-medium">
          Go Back
        </p>
      </div>
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
              pricingRef.current.scrollIntoView({
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

        <div className="tw:flex tw:gap-4">
          <div className="tw:flex tw:cursor-pointer tw:py-2 tw:gap-1">
            {isBookmarked(data.id) ? (
              <HeartIcon
                size={24}
                fill="#FF780B"
                color="#FF780B"
                className="tw:cursor-pointer tw:mb-4"
                onClick={() => toggleFavorite(data.id)}
              />
            ) : (
              <HeartIcon
                size={24}
                strokeWidth={2}
                fill="#7979791A"
                className="tw:cursor-pointer tw:text-[var(--color-font-light)]  tw:mb-4"
                onClick={() => toggleFavorite(data.id)}
              />
            )}

            <p className="tw:text-[#797979] tw:text-[14px] tw:font-normal">
              Bookmark
            </p>
          </div>
          <div
            className="tw:flex tw:cursor-pointer tw:py-2 tw:gap-1"
            onClick={() => {
              // copy the URL to clipboard
              navigator.clipboard.writeText(window.location.href);
              showToast("info", t("toast.shareInfo"));
            }}
          >
            <Share2
              size={24}
              strokeWidth={2}
              className="tw:cursor-pointer tw:text-[var(--color-font-light)] tw:mb-4"
            />
            <p className="tw:text-[#797979] tw:text-[14px] tw:font-normal">
              Share
            </p>
          </div>
        </div>
      </div>
      <div className="tw:flex tw:flex-col tw:mb-4">
        <h1 className="tw:font-semibold tw:text-[var(--color-font-dark)]  tw:text-[28px] ">
          {data.title}
        </h1>
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
            <button
              className="tw:flex tw:items-center tw:justify-center tw:bg-[var(--color-primary)] tw:gap-2 tw:px-5 tw:py-2"
              onClick={() => {
                setIsContactFormOpen(true);
              }}
            >
              <Send size={20} className="tw:text-white" />
              <p className="tw:text-white  tw:font-semibold m-0">Message</p>
            </button>
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
          <p className="tw:md:max-w-[80%] tw:line-clamp-6 tw:text-[16px] tw:text-[#797979] tw:font-normal tw:text-justify tw:break-all">
            {data.description?.replace(/<\/?[^>]+(>|$)/g, "") ||
              "No description available for this property."}
          </p>

          {/* Conditionally render the Read More button */}
          {shouldShowReadMore(data.description) && (
            <div className="fade-true tw:w-full tw:md:max-w-[80%] tw:absolute tw:bottom-0 p-4 tw:flex tw:items-center tw:justify-center tw:z-30">
              <button
                className="tw:bg-[#040342] tw:text-white tw:text-[14px] tw:font-semibold tw:py-2 tw:px-4"
                onClick={() => setIsShowDescriptionOpen(true)}
              >
                Read More
              </button>
            </div>
          )}
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
                    <img
                      src={exactPath(f.icon)}
                      alt={f.title}
                      className="tw:w-5 tw:h-5 tw:filter tw:brightness-0 tw:opacity-50"
                    />
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
              {`Property Overview`}
            </h2>

            <XIcon
              size={24}
              onClick={() => setIsShowDescriptionOpen(false)}
              className="tw:cursor-pointer"
            />
          </div>
          <div className="tw:p-4 tw:max-h-[60dvh] tw:overflow-y-auto">
            <p className="tw:text-justify">
              {data.description?.replace(/<\/?[^>]+(>|$)/g, "") +
                data.description?.replace(/<\/?[^>]+(>|$)/g, "") ||
                data.description?.replace(/<\/?[^>]+(>|$)/g, "") ||
                data.description?.replace(/<\/?[^>]+(>|$)/g, "") ||
                "No description available for this property."}
            </p>
          </div>
        </div>
      </GenericModal>

      <GenericModal isOpen={isShowFeaturesOpen} setOpen={setIsShowFeaturesOpen}>
        <div className="tw:bg-white tw:min-w-[40dvw] tw:max-w-[40dvw] tw:rounded-2xl">
          <div className="tw:flex tw:justify-between tw:bg-[#FAFBFC] tw:p-4 tw:rounded-2xl">
            <h2 className="tw:text-2xl tw:font-bold tw:text-left tw:text-[var(--color-font-dark)] tw:w-full">
              {`Features & Amenities`}
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
                <img
                  src={exactPath(f.icon)}
                  alt={f.title}
                  className="tw:w-5 tw:h-5"
                />
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
                {`Prices & Conditions`}
              </h2>
            </div>
            <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-4 tw:gap-6">
              {data?.prices.map((p, idx) => (
                <div
                  key={idx}
                  className="tw:bg-[#FAFBFC] tw:border tw:border-[#D8E0ED]  tw:p-4"
                >
                  <p className="tw:font-semibold  tw:text-[#FF780B]">
                    <span className="tw:text-[24px]"> ${p.amount} </span>
                    <span className="tw:text-[18px">
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
          {`Location`}
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

      <div>
        <h2 className="tw:text-[24px] tw:font-semibold tw:text-left tw:text-[var(--color-font-dark)] tw:w-full tw:mt-10">
          Similar Listing
        </h2>

        {/* Grid for Desktop */}
        <div className="tw:hidden tw:md:flex tw:gap-[30px] tw:pb-4">
          {featuredListings.map((listing, index) => (
            <ListingCard
              key={`listing-${index}`}
              listing={listing}
              toggleFavorite={toggleFavorite}
              isFavorite={isBookmarked(listing.id)}
            />
          ))}
        </div>

        <GenericModal isOpen={isContactFormOpen} setOpen={setIsContactFormOpen}>
          <ContactForm
            dwelling={data}
            onSuccess={() => {
              setIsContactFormOpen(false);
            }}
          />
        </GenericModal>

        {/* Carousel for Mobile */}
        <div className="tw:block tw:md:hidden">
          <Swiper
            spaceBetween={20}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="tw:pb-10 tw:swiper-pagination-bullet "
          >
            {featuredListings.map((listing, index) => (
              <SwiperSlide
                key={`listing-swipe-${index}`}
                className="tw:flex tw:justify-center tw:w-full"
              >
                <div className="tw:mb-4">
                  <ListingCard
                    listing={listing}
                    toggleFavorite={toggleFavorite}
                    isFavorite={isBookmarked(listing.id)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
