"use client";

import { hotelsData } from "../../../data/hotels";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import Image from "next/image";
import Link from "@/components/common/Link";
import { exactPath, getFromNowInLocale } from "@/utils";
import moment from "moment";
import BookmarkButton from "@/components/common/BookmarkButton";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import axios from "axios";
import { api } from "@/config";
import { BedDoubleIcon, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useBookmarks } from "@/context/BookmarkProvider";
import useFeatured from "@/hooks/useFeatured";

const GOLD_ICON = "/uploads/gold_2_f0a58631ab.png";
// const FREE_ICON = '/uploads/free_3afa39eb7c.png'
const SILVER_ICON = "/uploads/silver_2_b11d434025.png";
const PLATINUM_ICON = "/uploads/platinum_2_8843bd7328.png";

const HotelProperties = ({ data, isLoading }) => {


  const t = useTranslations("dwelling-card");
  const locale = useParams().locale;
  const { featuredListings, featuredListingsError, featuredListingsLoading } =
    useFeatured(locale);


  const handleRedirect = async (item) => {
    try {
      await axios.put(`${api}/api/dwellings/${item?.id}/viewed`);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <>
      <div className="tw:min-h-[calc(100vh-80px)] tw:w-full">
        {/* Loading State */}
        {isLoading && (
          <div className="tw:flex tw:items-center tw:justify-center tw:h-[200px]">
            {t("loading")}...
          </div>
        )}

        {/* Empty State */}
        {!isLoading && data?.length === 0 && (
          <div className="tw:flex tw:items-center tw:justify-center tw:h-[200px]">
            {t("not-found")}
          </div>
        )}

        {/* Data State */}
        {!isLoading && data?.length > 0 && (
          <div className="tw:space-y-10">
            {data.map((item, idx) => {
              const location = item?.location?.[0];
              const minPrice = item?.prices?.sort((a, b) => a.price - b.price)?.[0];
              const icon =
                item?.subscription?.package?.name === "Platinum"
                  ? PLATINUM_ICON
                  : item?.subscription?.package?.name === "Gold"
                    ? GOLD_ICON
                    : item?.subscription?.package?.name === "Silver"
                      ? SILVER_ICON
                      : null;


          return (
            <>

              <div className="tw:flex tw:font-primary tw:justify-center tw:gap-6 " key={idx}>
                {/* Responsive Card Container */}
                <div className="tw:w-full tw:max-w-[1280px] tw:flex tw:flex-col tw:felx-wrap tw:md:flex-row tw:shadow-md tw:overflow-hidden tw:relative tw:m-2">

                  {/* Left Image Section with min-width */}
                  <div className="tw:w-full tw:min-w-[300px] tw:max-w-full tw:min-h-[280px] tw:h-auto tw:md:max-w-[750px] tw:md:h-[400px] tw:relative">
                    <div className="tw:absolute tw:inset-0">
                      <div className="tw:w-full tw:h-full tw:relative tw:overflow-hidden">
                        <Swiper
                          className="tw:h-full tw:w-full"
                          modules={[Pagination, Navigation]}
                          pagination={{ clickable: true }}
                          navigation={true}
                        >
                          {item?.galleries?.length > 0 ? (
                            item.galleries
                              .sort((a, b) => a.order - b.order)
                              .map((slide, i) => (
                                <SwiperSlide key={i} className="tw:relative tw:w-full tw:h-full">
                                  <Image
                                    fill
                                    className=""
                                    src={exactPath(slide?.image?.url)}
                                    alt="property image"
                                    priority
                                    sizes="(max-width: 750px) 100vw, (min-width: 640px) 50vw, 750px"
                                  />
                                </SwiperSlide>
                              ))
                          ) : (
                            <SwiperSlide className="tw:relative tw:w-full tw:h-full">
                              <Image
                                fill
                                className=""
                                src={exactPath("/uploads/demo_cbcb7e3dc1.png")}
                                alt="default property image"
                                priority
                                sizes="(max-width: 639px) 100vw, (min-width: 640px) 50vw, 750px"
                              />
                            </SwiperSlide>
                          )}
                        </Swiper>

                        {/* Starting Price Tag */}
                        {featuredListings?.map((listing, idx) => (
                          <div key={`listing-${idx}`}>
                            <div className="tw:bg-white tw:z-20 tw:border tw:border-[#1b1b1b20] tw:absolute tw:bottom-3 tw:md:bottom-5 tw:left-3 tw:md:left-5 tw:w-[130px] tw:text-[var(--color-font-dark)] tw:md:w-[180px] tw:h-[40px] tw:md:h-[50px] tw:flex tw:items-center tw:justify-center tw:gap-2 tw:p-2">
                              <span className="tw:font-medium tw:text-[15px] tw:md:text-[18px]">
                                {listing?.price}$ / Per Night
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Bookmark */}
                        <div className="tw:absolute tw:top-3 tw:md:top-6 tw:right-3 tw:md:right-6 tw:z-10">
                          <BookmarkButton item={item || null} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Info Section */}
                  <div className="tw:w-full tw:md:w-auto tw:md:flex-1 tw:min-w-[300px] tw:md:min-w-[350px]  tw:h-auto tw:flex tw:flex-col tw:p-4 tw:md:p-6 tw:justify-between">
                    <div>
                      <h3 className="tw:text-[20px] tw:md:text-[28px] tw:font-semibold tw:mb-3 tw:text-[var(--color-font-dark)] tw:line-clamp-2">
                        {item?.title}
                      </h3>

                      <div className="tw:flex tw:items-start tw:md:items-center tw:gap-2 tw:md:gap-4 tw:mb-4 tw:text-[16px] tw:md:text-[20px] tw:font-normal tw:text-[var(--color-font-regular)]">
                        <MapPin className="tw:w-5 tw:md:w-6 tw:h-5 tw:md:h-6 tw:text-[var(--color-font-regular)]" />
                        <span className="tw:line-clamp-2">
                          {`${location?.street_one} ${location?.street_two}, ${location?.city || ""}, ${location?.country || ""}`}
                        </span>
                      </div>

                      {/* Price Options */}
                      <div className="tw:space-y-3 tw:md:space-y-5 tw:mb-6">
                        {item?.prices?.map((price, idx) => (
                          <div key={idx} className="tw:flex tw:gap-2 tw:md:gap-4 tw:items-center">
                            <BedDoubleIcon className="tw:w-5 tw:md:w-6 tw:h-5 tw:md:h-6 tw:text-[var(--color-font-regular)]" />
                            <span className="tw:text-[14px] tw:md:text-[16px] tw:font-semibold tw:text-[var(--color-font-regular)]">
                              {price?.amount}$ / {price.total ? `${price.total} X ` : ""}
                              {price?.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Button */}
                    <div className="tw:w-full ">
                      <Link
                        href={`/listings/${item?.slug}`}
                        onClick={async () => await handleRedirect(item)}
                        className="tw:w-full  tw:h-11 tw:md:h-12 tw:bg-[var(--color-primary)] tw:text-white tw:flex tw:items-center tw:justify-center tw:font-semibold tw:text-[16px] tw:md:text-[18px] "
                      >
                        {t("visit")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default HotelProperties;
