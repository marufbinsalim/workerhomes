"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ListingCard from "./ListingCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { useTranslations } from "next-intl";
import useFeatured from "@/hooks/useFeatured";
import { useBookmarks } from "@/context/BookmarkProvider";
import { showToast } from "@/components/toast/Toast";
import { useRouter } from "next/navigation";

const Dashboard = ({ locale, session }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [destination, setDestination] = useState("");
  const [guests, setGuests] = useState("");
  const [favorites, setFavorites] = useState({});
  const { featuredListings } = useFeatured(locale);
  const [isBookmarkedItem, setIsBookmarkedItem] = useState(false);
  const router = useRouter();

  const CustomInput = ({ value, onClick }) => {
    const formatDate = (date) => {
      if (!date) return { dayMonth: "", year: "" };
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      return { dayMonth: `${day} ${month}`, year: `${year}` };
    };

    const dateParts = value ? formatDate(new Date(value)) : formatDate(null);

    return (
      <div
        className="tw:w-full tw:border-none tw:outline-none tw:text-[var(--color-font-dark)] tw:cursor-pointer"
        onClick={onClick}
      >
        {dateParts.dayMonth ? (
          <>
            <div className=" tw:text-[18px] tw:md:text-[24px] tw:leading-tight tw:font-semibold tw:text-[var(--color-font-dark)]">
              {dateParts.dayMonth}
            </div>
            <div className="tw:text-[14px] tw:md:text-[16px] tw:font-semibold tw:text-[var(--color-font-light)] tw:leading-tight">
              {dateParts.year}
            </div>
          </>
        ) : (
          <div className="tw:text-[16px]  tw:text-[var(--color-font-light)]">
            {t("form.addDate")}
          </div>
        )}
      </div>
    );
  };

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

  const isMobile = useIsMobile();
  function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, [breakpoint]);

    return isMobile;
  }

  return (
    <>
      <section className="tw:relative font-primary tw:w-full tw:h-auto tw:md:h-[361px] tw:bg-red/500 tw:py-[60px] tw:md:py-[120px] tw:px-5 tw:md:px-[80px] tw:flex tw:flex-col tw:gap-6">
        {/* Background Image */}
        <div className="tw:absolute tw:inset-0 tw:z-0">
          <Image
            src="/assets/dashboardImage.jpg"
            alt="Work stay experience"
            layout="fill"
            objectFit="cover"
            className="tw:object-cover"
          />
          <div className="tw:absolute tw:inset-0 tw:bg-black/50 tw:z-10"></div>
        </div>

        {/* Content */}
        <div className="tw:relative tw:z-20 tw:max-w-full tw:mx-auto tw:my-4 tw:md:my-0 tw:text-white">
          <div className="tw:mb-8 tw:md:mt-0 tw:mt-4 tw:md:mb-20 tw:text-center">
            <p className="tw:text-4xl tw:md:text-6xl tw:font-semibold">
              {" "}
              {/* instead of arbitrary values */}
              {t("title")}
            </p>
            <p className="tw:text-[16px] tw:md:text-[20px] tw:font-semibold tw:mb-6 tw:md:mb-8">
              {t("subtitle")}
            </p>
          </div>

          <div className="tw:relative tw:z-20 tw:mt-6 tw:md:mt-[0px]">
            <div className="tw:flex tw:justify-center">
              <div className="tw:w-full tw:md:w-[1280px] tw:bg-white tw:rounded-sm tw:flex tw:flex-col tw:md:flex-row tw:gap-4 tw:md:justify-between tw:p-4 tw:md:p-5 tw:shadow-sm">
                {/* Where */}
                <div className="tw:flex-1 tw:px-0 tw:md:px-4 tw:flex tw:flex-col">
                  <label className="tw:font-bold tw:text-[var(--color-font-regular)]">
                    {t("form.location")}
                  </label>
                  <input
                    onChange={(e) => {
                      setDestination(e.target.value);
                    }}
                    value={destination}
                    type="text"
                    placeholder={t("form.wherePlaceholder")}
                    className="tw:border-none tw:outline-none tw:text-[18px] tw:md:text-[24px] tw:leading-tight tw:font-semibold tw:text-[var(--color-font-dark)] tw:placeholder:text-[14px] tw:md:placeholder:text-[16px] tw:placeholder-[var(--color-font-light)]"
                  />
                </div>

                {/* Check-in */}
                <div className="tw:flex-1 tw:px-0 tw:md:px-4 tw:flex tw:flex-col tw:border-t-2 tw:md:border-t-0 tw:md:border-l-2 tw:border-[var(--color-border-light)]">
                  <label className="tw:font-bold tw:text-[var(--color-font-regular)] tw:mb-2">
                    {t("form.checkIn")}
                  </label>
                  <DatePicker
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    dateFormat="d MMMM yyyy"
                    showPopperArrow={false}
                    customInput={<CustomInput />}
                    placeholderText=""
                    withPortal={isMobile}
                  />
                </div>

                {/* Check-out */}
                <div className="tw:flex-1 tw:px-0 tw:md:px-4 tw:flex tw:flex-col tw:border-t-2 tw:md:border-t-0 tw:md:border-l-2 tw:border-[var(--color-border-light)]">
                  <label className="tw:font-bold tw:text-[var(--color-font-regular)] tw:mb-2">
                    {t("form.checkOut")}
                  </label>
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    dateFormat="d MMMM yyyy"
                    showPopperArrow={false}
                    minDate={checkInDate}
                    customInput={<CustomInput />}
                    placeholderText=""
                    withPortal={isMobile}
                  />
                </div>

                {/* Guests */}
                <div className="tw:flex-1 tw:px-0 tw:md:px-4 tw:flex tw:flex-col tw:border-t-2 tw:md:border-t-0 tw:md:border-l-2 tw:border-[var(--color-border-light)]">
                  <label className="tw:font-bold tw:text-[var(--color-font-regular)]">
                    {t("form.guests")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder={t("form.whoPlaceholder")}
                    className="tw:border-none tw:outline-none tw:text-[18px] tw:md:text-[24px] tw:leading-tight tw:font-semibold tw:text-[var(--color-font-dark)] tw:placeholder:text-[14px] tw:md:placeholder:text-[16px] tw:placeholder-[var(--color-font-light)]"
                  />
                </div>

                {/* Search Icon */}
                <div className="tw:flex tw:items-center tw:justify-center tw:mt-4 tw:md:mt-0 tw:md:ml-4">
                  <button
                    onClick={() => {
                      router.push(`listings?location=${destination}`);
                    }}
                    className={`
                                                tw:group
                                                tw:w-12 tw:h-12 tw:md:w-16 tw:md:h-16
                                                tw:rounded-full
                                                tw:border-2 tw:border-[#040342]
                                                tw:flex tw:items-center tw:justify-center
                                                tw:p-4 tw:md:p-5
                                                tw:bg-white
                                                tw:hover:bg-[#040342]
                                                tw:transition-colors
                                                tw:cursor-pointer
                                                `}
                  >
                    <FiSearch className="tw:text-[#040342] tw:group-hover:text-white tw:text-lg tw:md:text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities section */}
      <section className="tw:w-full font-primary tw:min-h-screen tw:py-[60px] tw:md:py-[120px] tw:px-5 tw:md:px-[80px] tw:flex tw:flex-col">
        <div className="tw:w-full">
          <div className="tw:flex tw:flex-col tw:md:flex-row tw:justify-between tw:items-start tw:md:items-center tw:w-full tw:max-w-[1280px] tw:mx-auto tw:gap-4">
            <div>
              <h1 className="tw:text-[28px] tw:md:text-[32px] tw:text-[var(--color-font-dark)] tw:font-semibold">
                {" "}
                {t("popularCitiesSection.title")}{" "}
              </h1>
              <p className="tw:text-[16px] tw:md:text-[18px] tw:text-[var(--color-font-regular)] tw:mt-2">
                {t("popularCitiesSection.subtitle")}
              </p>
            </div>
            <button className="tw:text-[14px] tw:font-bold tw:text-[var(--color-font-dark)] tw:hover:underline tw:self-end tw:md:self-auto">
              {t("popularCitiesSection.seeAllButton")}
            </button>
          </div>
        </div>

        <div className="tw:flex tw:flex-col tw:items-center tw:gap-6 tw:md:gap-[30px] tw:mt-6 tw:md:mt-2">
          {/* Row 1 */}
          <div className="tw:flex tw:flex-col tw:md:flex-row tw:w-full tw:gap-6 tw:md:gap-[30px] tw:justify-center ">
            {/* Frankfurt */}
            <div className="tw:relative tw:w-full tw:md:w-[755px] tw:h-[200px] tw:sm:h-[300px] tw:md:h-[540px] tw:overflow-hidden tw:bg-red-300">
              <Image
                src="/assets/frankfurt.jpg"
                alt="Frankfurt"
                fill
                className="tw:object-cover"
              />
              <div className="tw:absolute tw:inset-0 tw:bg-black/30 tw:flex tw:items-start tw:justify-start tw:p-4 tw:md:p-8">
                <div>
                  <h2 className="tw:text-lg tw:sm:text-[22px] tw:md:text-[28px] tw:font-bold tw:text-white tw:mb-0">
                    {t("popularCitiesSection.cities.frankfurt.name")}
                  </h2>
                  <p className="tw:text-base tw:sm:text-[18px] tw:md:text-[24px] tw:text-[#fafbfc]">
                    {t("popularCitiesSection.cities.frankfurt.country")}
                  </p>
                </div>
              </div>
            </div>

            {/* Munich */}
            <div className="tw:relative tw:w-full tw:md:w-[495px] tw:h-[200px] tw:sm:h-[300px] tw:md:h-[540px] tw:overflow-hidden">
              <Image
                src="/assets/munich.jpg"
                alt="Munich"
                fill
                className="tw:object-cover"
              />
              <div className="tw:absolute tw:inset-0 tw:bg-black/30 tw:flex tw:items-start tw:justify-start tw:p-4 tw:md:p-8">
                <div>
                  <h2 className="tw:text-lg tw:sm:text-[22px] tw:md:text-[28px] tw:font-bold tw:text-white tw:mb-0">
                    {t("popularCitiesSection.cities.munich.name")}
                  </h2>
                  <p className="tw:text-base tw:sm:text-[18px] tw:md:text-[24px] tw:text-[#fafbfc]">
                    {t("popularCitiesSection.cities.munich.country")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="tw:flex tw:flex-col tw:md:flex-row tw:gap-6 tw:md:gap-[30px] tw:justify-center tw:w-full">
            {/* Warsaw */}
            <div className="tw:relative tw:w-full tw:md:w-[406px] tw:h-[180px] tw:sm:h-[250px] tw:md:h-[471px] tw:overflow-hidden">
              <Image
                src="/assets/warsaw.jpg"
                alt="Warsaw"
                fill
                className="tw:object-cover"
              />
              <div className="tw:absolute tw:inset-0 tw:bg-black/30 tw:flex tw:items-start tw:justify-start tw:p-4 tw:md:p-8">
                <div>
                  <h2 className="tw:text-lg tw:sm:text-[22px] tw:md:text-[28px] tw:font-bold tw:text-white tw:mb-0">
                    {t("popularCitiesSection.cities.warsaw.name")}
                  </h2>
                  <p className="tw:text-base tw:sm:text-[18px] tw:md:text-[24px] tw:text-[#fafbfc]">
                    {t("popularCitiesSection.cities.warsaw.country")}
                  </p>
                </div>
              </div>
            </div>

            {/* Hamburg */}
            <div className="tw:relative tw:w-full tw:md:w-[406.67px] tw:h-[180px] tw:sm:h-[250px] tw:md:h-[471px] tw:overflow-hidden">
              <Image
                src="/assets/humburg.jpg"
                alt="Hamburg"
                fill
                className="tw:object-cover"
              />
              <div className="tw:absolute tw:inset-0 tw:bg-black/30 tw:flex tw:items-start tw:justify-start tw:p-4 tw:md:p-8">
                <div>
                  <h2 className="tw:text-lg tw:sm:text-[22px] tw:md:text-[28px] tw:font-bold tw:text-white tw:mb-0">
                    {t("popularCitiesSection.cities.hamburg.name")}
                  </h2>
                  <p className="tw:text-base tw:sm:text-[18px] tw:md:text-[24px] tw:text-[#fafbfc]">
                    {t("popularCitiesSection.cities.hamburg.country")}
                  </p>
                </div>
              </div>
            </div>

            {/* Edinburgh */}
            <div className="tw:relative tw:w-full tw:md:w-[406.67px] tw:h-[180px] tw:sm:h-[250px] tw:md:h-[471px] tw:overflow-hidden">
              <Image
                src="/assets/edinburgh.jpg"
                alt="Edinburgh"
                fill
                className="tw:object-cover"
              />
              <div className="tw:absolute tw:inset-0 tw:bg-black/30 tw:flex tw:items-start tw:justify-start tw:p-4 tw:md:p-8">
                <div>
                  <h2 className="tw:text-lg tw:sm:text-[22px] tw:md:text-[28px] tw:font-bold tw:text-white tw:mb-0">
                    {t("popularCitiesSection.cities.edinburgh.name")}
                  </h2>
                  <p className="tw:text-base tw:sm:text-[18px] tw:md:text-[24px] tw:text-[#fafbfc]">
                    {t("popularCitiesSection.cities.edinburgh.country")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* what we are section */}
      <section className="tw:w-full font-primary tw:py-[40px] tw:bg-[#F8F9FB]">
        <div className="tw:max-w-[1280px] tw:mx-auto tw:flex tw:flex-col">
          <div className="tw:mb-[20px]  tw:flex tw:flex-col tw:items-center tw:md:items-start">
            <h2 className="tw:text-[32px] tw:font-semibold tw:text-[var(--color-font-dark)]">
              {t("whoWeAreSection.title")}
            </h2>
            <p className="tw:text-[18px] tw:font-normal tw:text-[var(--color-font-regular)] tw:leading-[100%] tw:text-center tw:px-4 tw:md:px-0">
              {t("whoWeAreSection.subtitle")}
            </p>
          </div>

          <div className="tw:flex tw:flex-col tw:md:flex-row tw:items-center tw:md:justify-center tw:gap-[40px] tw:md:gap-[60px]">
            {/* Card 1 */}
            <div className="tw:w-[386px] tw:h-[455px] tw:pt-[20px] tw:pb-[20px] tw:flex tw:flex-col tw:items-center tw:gap-[16px]">
              <img
                src="/assets/extensive.png"
                alt="Extensive Listings"
                className="tw:w-[302px] tw:h-[250px] tw:object-contain"
              />
              <h3 className="tw:text-[28px] tw:font-semibold tw:text-[var(--color-font-dark)] tw:leading-[100%]">
                {t("whoWeAreSection.cards.extensiveListings.title")}
              </h3>
              <p className="tw:text-[18px] tw:font-normal tw:text-[var(--color-font-regular)] tw:leading-[100%] tw:text-center tw:px-4">
                {t("whoWeAreSection.cards.extensiveListings.description")}
              </p>
            </div>

            {/* Card 2 */}
            <div className="tw:w-[386px] tw:h-[455px] tw:pt-[20px] tw:pb-[20px] tw:flex tw:flex-col tw:items-center tw:gap-[16px]">
              <img
                src="/assets/easytouse.png"
                alt="Easy-to-Use Platform"
                className="tw:w-[375px] tw:h-[250px] tw:object-contain"
              />
              <h3 className="tw:text-[28px] tw:font-semibold tw:text-[var(--color-font-dark)] tw:leading-[100%]">
                {t("whoWeAreSection.cards.easyToUse.title")}
              </h3>
              <p className="tw:text-[18px] tw:font-normal tw:text-[var(--color-font-regular)] tw:text-center tw:px-4">
                {t("whoWeAreSection.cards.easyToUse.description")}
              </p>
            </div>

            {/* Card 3 */}
            <div className="tw:w-[386px] tw:h-[455px] tw:pt-[20px] tw:pb-[20px] tw:flex tw:flex-col tw:items-center tw:gap-[16px]">
              <img
                src="/assets/flexible.png"
                alt="Flexible Solutions"
                className="tw:w-[250px] tw:h-[250px] tw:object-contain"
              />
              <h3 className="tw:text-[28px] tw:font-semibold tw:text-[var(--color-font-dark)] tw:leading-[100%]">
                {t("whoWeAreSection.cards.flexibleSolutions.title")}
              </h3>
              <p className="tw:text-[18px] tw:font-normal tw:text-[var(--color-font-regular)] tw:leading-[100%] tw:text-center tw:px-4">
                {t("whoWeAreSection.cards.flexibleSolutions.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tw:w-full font-primary tw:min-h-[814px] tw:px-5 tw:py-[80px] tw:md:px-[80px] tw:flex tw:flex-col tw:md:gap-[30px]">
        <div className="tw:max-w-[1280px] tw:w-full tw:mx-auto tw:flex tw:flex-col">
          {/* Section Header */}
          <div className="tw:w-full">
            <div className="tw:flex tw:flex-col tw:md:flex-row tw:justify-between tw:items-start tw:md:items-center tw:w-full tw:max-w-[1280px] tw:mx-auto tw:gap-4">
              <div>
                <h2 className="tw:text-[28px] tw:md:text-[32px] tw:font-semibold tw:text-[var(--color-font-dark)]">
                  {t("featuredListingsSection.title")}
                </h2>
                <p className="tw:text-[16px] tw:md:text-[18px] tw:text-[var(--color-font-regular)] tw:mt-2">
                  {t("featuredListingsSection.subtitle")}
                </p>
              </div>
              <button className="tw:text-[14px] tw:font-bold tw:text-[var(--color-font-dark)] tw:hover:underline tw:self-end tw:md:self-auto">
                {t("featuredListingsSection.seeAllButton")}
              </button>
            </div>
          </div>

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
      </section>
    </>
  );
};

export default Dashboard;
