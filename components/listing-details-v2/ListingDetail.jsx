"use client";

import { google_key } from "@/config";
import { exactPath } from "@/utils";
import { MapPin, Phone, Send } from "lucide-react";
import MapComponent from "@/components/common/MapComponent";
import { useTranslations } from "next-intl";
import GenericModal from "./GenericModal";
import { useState } from "react";
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

function ImageGrid({ images, setOpen }) {
  let imagesToShow = images ? [...images].slice(0, 4) : [];

  if (!imagesToShow || imagesToShow.length === 0) {
    return (
      <p className="tw:text-center tw:text-gray-500">No images available</p>
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

  const [isImageSliderOpen, setIsImageSliderOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const { featuredListings, featuredListingsError, featuredListingsLoading } =
    useFeatured(locale);
  const [isBookmarkedItem, setIsBookmarkedItem] = useState(false);

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
        isNowBookmarked ? t("toast.favoriteRemoved") : t("toast.favoriteAdded"),
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
              <p className="tw:text-white m-0">Message</p>
            </button>
          </div>
        </div>
      </div>
      {JSON.stringify(data)}

      {data?.prices?.length > 0 && (
        <section className="tw:pt-12 tw:pb-20">
          <div className="mx-auto">
            <div className="tw:flex tw:flex-col tw:items-center">
              <h2 className="tw:text-2xl tw:font-bold tw:text-left tw:text-[var(--color-font-dark)] tw:w-full">
                {`Prices & Conditions`}
              </h2>
            </div>
            <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-4 tw:gap-6">
              {data?.prices.map((p, idx) => (
                <div
                  key={idx}
                  className="tw:bg-[#FAFBFC] tw:rounded-md tw:shadow-sm tw:p-4"
                >
                  <p className="tw:font-bold tw:text-lg tw:text-[#FF780B]">
                    ${p.amount}{" "}
                    <span className="">
                      / {p.total ? `${p.total} x ${p.type}` : p.type}
                    </span>
                  </p>
                  <p className="tw:text-sm tw:mt-2 tw:text-[#797979]">
                    Number of Guests:{" "}
                    <span className="tw:font-semibold tw:text-black">
                      {p.guest}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="tw:w-full tw:h-[300px] tw:md:h-[600px] tw:rounded-[10px] tw:overflow-hidden">
        <h2 className="tw:text-2xl tw:font-bold tw:text-left tw:text-[var(--color-font-dark)] tw:w-full">
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
        <h2 className="tw:text-2xl tw:font-bold tw:text-left tw:text-[var(--color-font-dark)] tw:w-full tw:mt-10">
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
