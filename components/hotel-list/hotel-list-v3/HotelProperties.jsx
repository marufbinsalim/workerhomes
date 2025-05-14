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

const GOLD_ICON = "/uploads/gold_2_f0a58631ab.png";
// const FREE_ICON = '/uploads/free_3afa39eb7c.png'
const SILVER_ICON = "/uploads/silver_2_b11d434025.png";
const PLATINUM_ICON = "/uploads/platinum_2_8843bd7328.png";

const HotelProperties = ({ data, isLoading }) => {
  const t = useTranslations("dwelling-card");
  const locale = useParams().locale;

  const handleRedirect = async (item) => {
    try {
      await axios.put(`${api}/api/dwellings/${item?.id}/viewed`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {data?.length > 0 && !isLoading ? (
        data?.map((item, idx) => {
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
            <div className="col-12" key={idx}>
              <div className="border-top-light py-20">
                <div className="row x-gap-10 y-gap-10">
                  <div className="col-md-auto">
                    <div className="cardImage ratio ratio-1:1 w-200 md:w-1/1 rounded-4">
                      <div className="cardImage__content custom_inside-slider">
                        <Swiper
                          className="mySwiper"
                          modules={[Pagination, Navigation]}
                          pagination={{
                            clickable: true,
                          }}
                          navigation={true}
                        >
                          {item?.galleries?.length > 0 ? (
                            item?.galleries
                              ?.sort((a, b) => a.order - b.order)
                              ?.map((slide, i) => (
                                <SwiperSlide
                                  key={i}
                                  style={{
                                    width: "200px",
                                    height: "200px",
                                    position: "relative",
                                  }}
                                >
                                  <Image
                                    fill
                                    style={{ objectFit: "cover" }}
                                    src={exactPath(slide?.image?.url)}
                                    alt="image"
                                  />
                                </SwiperSlide>
                              ))
                          ) : (
                            <SwiperSlide
                              style={{
                                width: "200px",
                                height: "200px",
                                position: "relative",
                              }}
                            >
                              <Link
                                href={`/listings/${item?.slug}`}
                                onClick={async () => await handleRedirect(item)}
                              >
                                <Image
                                  fill
                                  style={{ objectFit: "cover" }}
                                  src={exactPath(
                                    "/uploads/demo_cbcb7e3dc1.png",
                                  )}
                                  alt="image"
                                />
                              </Link>
                            </SwiperSlide>
                          )}
                        </Swiper>
                      </div>

                      {/* End image */}

                      <div className="cardImage__wishlist">
                        <BookmarkButton item={item || null} />
                      </div>
                    </div>
                  </div>
                  {/* End .col */}

                  <div className="col-md">
                    <Link
                      href={`/listings/${item?.slug}`}
                      onClick={async () => await handleRedirect(item)}
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <div>
                          <span>
                            <h3 className="text-18 lh-17 fw-900 capitalize text-truncate text-dark row justify-center x-gap-20 items-center">
                              <span
                                className={`text-truncate ${
                                  icon ? "ml-10" : "ml-20"
                                }`}
                              >
                                {icon && (
                                  <Image
                                    src={exactPath(icon)}
                                    width={28}
                                    height={28}
                                  />
                                )}
                                {item?.title}
                              </span>
                            </h3>

                            <span className="text-truncate text-black ml-10">
                              {`${location?.street_one} ${
                                location?.street_two
                              }, ${location?.city || ""}, ${
                                location?.country || ""
                              }`}
                            </span>
                          </span>
                          <div className="d-flex items-center mt-20 gap-1 ml-10">
                            {item?.features?.length > 0 &&
                              item?.features?.slice(0, 6)?.map((fet, i) => {
                                return (
                                  <div
                                    key={i}
                                    className="flex-center bg-blue-1 rounded-4 size-20 text-12 fw-600 text-white"
                                  >
                                    <Image
                                      src={exactPath(fet?.icon?.url)}
                                      alt={fet?.title}
                                      width={15}
                                      height={15}
                                    />
                                  </div>
                                );
                              })}

                            {item?.features?.length > 6 && (
                              <div className="text-14 text-light-1 ml-10">
                                +
                                {item?.features?.length > 6
                                  ? item?.features?.length - 6
                                  : null}{" "}
                                {t("more")}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className=" text-right md:text-left mt-1">
                          <div className="row x-gap-10 y-gap-10 justify-end items-center md:justify-start">
                            <div className="col-auto">
                              <div className="d-flex items-center lh-14 mb-5">
                                <div className="text-14 text-light-1">
                                  {t("posted")}{" "}
                                  {getFromNowInLocale(locale, item?.createdAt)}{" "}
                                </div>
                                <div className="size-3 bg-light-1 rounded-full ml-10 mr-10" />
                                <div className="text-14 text-light-1">
                                  {item?.category?.title}
                                </div>
                              </div>

                              {/* <div className='text-14 lh-14 text-light-1'>
                          {t('min-stay')}: {minPrice?.min_stay || 0} days
                        </div>
                        <div className='text-14 lh-14 text-light-1'>
                          {t('guests')}: {minPrice?.guest || 0}
                        </div> */}
                            </div>
                          </div>

                          {/* End .row */}
                          <Link
                            href={`/listings/${item?.slug}`}
                            onClick={async () => await handleRedirect(item)}
                            className="button py-10 px-20 -dark-1 bg-blue-1 text-white mt-10"
                          >
                            {t("visit")}{" "}
                            <div className="icon-arrow-top-right ml-15"></div>
                          </Link>
                        </div>
                      </div>
                      <div className="row x-gap-10 y-gap-10 mt-10">
                        {item?.prices?.map((price, idx) => (
                          <div
                            key={idx}
                            className="col-auto col-md-3  px-3 py-2 lh-13"
                          >
                            <div className="text-18 lh-12 fw-600 text-blue-1 ">
                              zł {price?.amount}
                            </div>
                            <div className="">
                              <div className="lowercase badge my-1">
                                {price.total ? `${price.total} X ` : ""}
                                {price?.type}{" "}
                              </div>
                              <div className="text-12 lh-12 fw-600 text-dark-1 ">
                                {t("min-stay")}{" "}
                                <span className="text-blue-1">
                                  {price?.min_stay}
                                </span>{" "}
                                {t("days")}
                              </div>
                              <div className="text-12 lh-12 fw-600 text-dark-1 ">
                                {t("guests")}{" "}
                                <span className="text-blue-1">
                                  {price?.guest || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Link>
                  </div>
                  {/* End .col-md */}

                  {/* End .col */}
                </div>
                {/* End .row */}
              </div>
            </div>
          );
        })
      ) : data?.length === 0 && !isLoading ? (
        <div className="col-12">{t("not-found")}</div>
      ) : (
        <div className="col-12">{t("loading")}...</div>
      )}
    </>
  );
};

export default HotelProperties;
