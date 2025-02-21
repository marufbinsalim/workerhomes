"use client";

import Divider from "@/components/common/Divider";
import { calculateRemainingTime, exactPath, formatDate } from "@/utils";
import { Icon } from "@iconify/react";
import React from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";
import { update, status } from "@/lib/services/dwelling";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { roles } from "@/config";
import { useSession } from "next-auth/react";

const ReviewDwelling = ({ item, onSuccess }) => {
  const t = useTranslations("review");
  const locale = useParams().locale;
  const [view, setView] = React.useState(false);
  const [loading, setLoading] = React.useState({
    status: false,
    recommended: false,
  });
  const { data: session } = useSession();

  const handleView = (value) => {
    if (value?.length > 80) {
      return (
        <>
          <span
            dangerouslySetInnerHTML={{
              __html: view ? value : value?.slice(0, 80),
            }}
          />
          {value?.length > 80 && (
            <span
              className="pointer text-blue-1 w-fit"
              onClick={() => setView(!view)}
            >
              {!view ? "readmore" : "read less"}
            </span>
          )}
        </>
      );
    } else {
      return <p dangerouslySetInnerHTML={{ __html: value }} />;
    }
  };

  const handleStatus = async (value) => {
    setLoading({
      recommended: false,
      status: true,
    });
    const data = {
      id: value?.id,
      status: value?.status,
    };
    try {
      await status(data, "Successfully Updated");
      onSuccess && onSuccess();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading({
        recommended: false,
        status: false,
      });
    }
  };

  const handleRecommended = async (value) => {
    setLoading({
      recommended: true,
      status: false,
    });
    const data = {
      id: value?.id,
      isRecommended: value?.value,
    };

    try {
      await update(
        data,
        value?.value === true ? "Successfully Added" : "Successfully Removed",
      );
      onSuccess && onSuccess();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading({
        recommended: false,
        status: false,
      });
    }
  };

  return (
    <div>
      <section className=" layout-pb-sm">
        <Divider side="center" title={t("items.details")} className="my-1" />
        <div className="container">
          <div className="row x-gap-10 y-gap-10  justify-between items-center">
            <div className="col-md-6 col-sm-12 text-16 text-dark-1 row ">
              <h6 className="fw-900">{t("items.owner")}</h6>
              {item?.owner?.id ? (
                <>
                  <span className="">
                    {`${item?.owner?.first_name || ""} ${
                      item?.owner?.last_name || ""
                    }`}
                    <br />
                    <span className="d-flex align-items-center gap-2 text-blue-1 text-12">
                      <Icon icon="mi:email" />

                      {item?.owner?.email || ""}
                    </span>
                  </span>
                </>
              ) : (
                <span className="badge col-6">{t("items.no-owner")}</span>
              )}
            </div>
            <div className="col-md-6 col-sm-12 text-16 text-dark-1 row ">
              <h6 className="fw-900">{t("items.created-by")}</h6>
              <span className="">
                {`${item?.subscription?.user?.first_name || ""} ${
                  item?.subscription?.user?.last_name || ""
                }`}
                <br />
                <span className="d-flex align-items-center gap-2 text-blue-1 text-12">
                  <Icon icon="mi:email" />

                  {item?.subscription?.user?.email || ""}
                </span>
              </span>
            </div>
            <div className="col-md-6 col-sm-12 text-16 text-dark-1 row ">
              <h6 className="fw-900">{t("items.title")}</h6>
              <span className="">{item?.title}</span>
            </div>
            <div className="col-12 text-16 text-dark-1 row ">
              <h6 className="fw-900">{t("items.description")}</h6>
              {handleView(item?.description)}
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pb-sm">
        <Divider
          side="center"
          title={t("items.current-state")}
          className="my-1"
        />
        <div className="container">
          <div className="row x-gap-10 y-gap-10  justify-between items-center">
            <div className="col-4 text-16 text-dark-1 row ">
              <span className="fw-500">{t("items.current-state")}</span>
              <span className="badge">{item?.status}</span>
            </div>
            <div className="col-4 text-16 text-dark-1 row ">
              <span className="fw-500">{t("items.approved")}</span>
              <span className="badge">
                {item?.isApproved ? t("items.yes") : t("items.no")}
              </span>
            </div>
            <div className="col-4 text-16 text-dark-1 row ">
              <span className="fw-500">{t("items.recommended")}</span>
              <span className="badge">
                {item?.isRecommended ? t("items.yes") : t("items.no")}
              </span>
            </div>
            <div className="col-4 text-16 text-dark-1 row ">
              <span className="fw-500">{t("items.translation")}</span>
              <span className="badge">
                {item?.localizations?.length > 0
                  ? item?.localizations?.map((i) => i.locale).join(", ")
                  : t("items.no-translation")}
              </span>
            </div>
            <div className="col-4 text-16 text-dark-1 row ">
              <span className="fw-500">{t("items.category")}</span>
              <span className="badge">{item?.category?.title}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pb-sm">
        <Divider
          side="center"
          title={t("items.payment-details")}
          className="my-1"
        />
        <div className="container">
          <div className="row x-gap-10 y-gap-10  justify-between items-center">
            <div className="col-4 text-16 text-dark-1 row ">
              <span className="fw-500">{t("items.current-plan")}</span>
              <span className="badge">{item?.subscription?.package?.name}</span>
            </div>
            <div className="col-4 text-16 text-dark-1 row ">
              <span className="fw-500">{t("items.payment-status")}</span>
              <span className="badge">
                {item?.subscription?.stripe_current_period_start
                  ? t("items.paid")
                  : item?.subscription?.isFree
                    ? t("items.free")
                    : t("items.assigned-admin")}
              </span>
            </div>
            <div className="col-4 text-16 text-dark-1 row ">
              <span className="fw-500">{t("items.payment-amount")}</span>
              <span className="badge uppercase">
                {item?.subscription?.payment_amount
                  ? `${item?.subscription?.payment_currency} ${item?.subscription?.payment_amount}`
                  : 0}
              </span>
            </div>
            <div className="col-4 text-16 text-dark-1 row ">
              <span className="fw-500">{t("items.start-date")}</span>
              <span className="badge">
                {item?.subscription?.start_date
                  ? formatDate(item?.subscription?.start_date, false, locale)
                  : "N/A"}
              </span>
            </div>
            <div className="col-4 text-16 text-dark-1 row ">
              <span className="fw-500">{t("items.end-date")}</span>
              <span className="badge">
                {item?.subscription?.end_date
                  ? formatDate(item?.subscription?.end_date, false, locale)
                  : item?.subscription?.isFree
                    ? t("items.unlimited")
                    : item?.subscription?.isExpired
                      ? t("items.expired")
                      : "N/A"}
              </span>
            </div>
            <div className="col-4 text-16 text-dark-1 row ">
              <span className="fw-500">{t("remaining-period")}</span>
              <span className="badge">
                {item?.subscription?.end_date
                  ? calculateRemainingTime(item?.subscription?.end_date)
                  : item?.subscription?.isFree
                    ? t("items.unlimited")
                    : item?.subscription?.isExpired
                      ? t("items.expired")
                      : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {item?.subscription?.pending_subscription?.id ? (
        <section className="layout-pb-sm">
          <Divider
            side="center"
            title={t("items.pending-subscription")}
            className="my-1"
          />
          <div className="container">
            <div className="row x-gap-10 y-gap-10  justify-between items-center">
              <div className="col-4 text-16 text-dark-1 row ">
                <span className="fw-500">{t("items.current-plan")}</span>
                <span className="badge">
                  {item?.subscription?.pending_subscription?.package?.name}
                </span>
              </div>
              <div className="col-4 text-16 text-dark-1 row ">
                <span className="fw-500">{t("items.payment-status")}</span>
                <span className="badge">
                  {item?.subscription?.pending_subscription?.payment_status
                    ? t("items.free")
                    : item?.subscription?.pending_subscription?.isFree
                      ? t("items.free")
                      : t("items.assigned-admin")}
                </span>
              </div>
              <div className="col-4 text-16 text-dark-1 row ">
                <span className="fw-500">{t("items.payment-amount")}</span>
                <span className="badge uppercase">
                  {item?.subscription?.pending_subscription?.payment_amount
                    ? `${item?.subscription?.pending_subscription?.payment_currency} ${item?.subscription?.pending_subscription?.payment_amount}`
                    : 0}
                </span>
              </div>
              <div className="col-4 text-16 text-dark-1 row ">
                <span className="fw-500">{t("items.start-date")}</span>
                <span className="badge">
                  {item?.subscription?.pending_subscription?.start_date
                    ? formatDate(
                        item?.subscription?.pending_subscription?.start_date,
                        false,
                        locale,
                      )
                    : "N/A"}
                </span>
              </div>

              <div className="col-4 text-16 text-dark-1 row ">
                <span className="fw-500">{t("items.end-date")}</span>
                <span className="badge">
                  {item?.subscription?.pending_subscription?.end_date
                    ? formatDate(
                        item?.subscription?.pending_subscription?.end_date,
                        false,
                        locale,
                      )
                    : item?.subscription?.pending_subscription?.isFree
                      ? "Unlimited"
                      : item?.subscription?.pending_subscription?.isExpired
                        ? "Expired"
                        : "N/A"}
                </span>
              </div>
              <div className="col-4 text-16 text-dark-1 row ">
                <span className="fw-500">{t("remaining-period")}</span>
                <span className="badge">
                  {item?.subscription?.pending_subscription?.end_date
                    ? calculateRemainingTime(
                        item?.subscription?.pending_subscription?.end_date,
                      )
                    : item?.subscription?.pending_subscription?.isFree
                      ? t("items.unlimited")
                      : item?.subscription?.pending_subscription?.isExpired
                        ? t("items.expired")
                        : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="layout-pb-sm">
        <Divider
          side="center"
          title={`${t("items.uploaded-images")} (${
            item?.galleries?.length || 0
          } / ${item?.subscription?.package?.pics || 0})`}
          className="my-1"
        />
        <div>
          {item?.galleries?.length > 0 ? (
            <Gallery>
              <div className="row x-gap-10 y-gap-10 -type-1 mt-20">
                {item?.galleries?.length > 0 &&
                  item?.galleries?.map((image, index) => {
                    return (
                      <div
                        className="col-2 relative d-flex justify-end"
                        key={index}
                      >
                        <Item
                          original={exactPath(image?.image?.url)}
                          thumbnail={exactPath(
                            image?.image?.formats?.thumbnail?.url,
                          )}
                          width={image?.image?.width}
                          height={image?.image?.height}
                        >
                          {({ ref, open }) => (
                            <img
                              ref={ref}
                              onClick={open}
                              src={exactPath(
                                image?.image?.formats?.thumbnail?.url,
                              )}
                              alt="image"
                              className="rounded-4"
                              role="button"
                              height="150px"
                              width="100%"
                            />
                          )}
                        </Item>
                      </div>
                    );
                  })}
              </div>
            </Gallery>
          ) : (
            <h6 className="text-center py-20">{t("items.no-images")}</h6>
          )}
        </div>
      </section>

      <section className="layout-pb-sm">
        <Divider side="center" title={t("items.features")} className="my-1" />

        <div className="d-flex gap-1 items-center flex-wrap">
          {item?.features?.length > 0 ? (
            item?.features?.map((feature, index) => (
              <div
                key={feature.id}
                className="bg-blue-1 rounded-4 text-12 fw-600 text-white d-flex justify-center items-center gap-1 px-10 py-5"
              >
                <Image
                  src={exactPath(feature?.icon?.url)}
                  alt={feature?.title}
                  width={20}
                  height={20}
                />
                <span className="capitalize text-white">{feature?.title}</span>
              </div>
            ))
          ) : (
            <div>{t("items.no-features")}</div>
          )}
        </div>
      </section>

      <section className="layout-pb-sm">
        <Divider side="center" title={t("items.amenities")} className="my-1" />

        <div className="d-flex gap-1 items-center flex-wrap">
          {item?.amenities?.length > 0 ? (
            item?.amenities?.map((amt, index) => (
              <div
                key={amt.id}
                className="bg-blue-1 rounded-4 text-12 fw-600 text-white d-flex justify-center items-center gap-1 px-10 py-5"
              >
                <span className="capitalize text-white">{amt?.title}</span>
              </div>
            ))
          ) : (
            <div>{t("items.no-amenities")}</div>
          )}
        </div>
      </section>

      <section className="layout-pb-sm">
        <Divider side="center" title={t("items.prices")} className="my-1" />

        <div className="row x-gap-20 y-gap-20  mt-20">
          {item?.prices?.length > 0 ? (
            item?.prices?.map((price, index) => (
              <div
                key={price.id}
                className="col-6 rounded-4 text-dark-1 fw-600 price-card"
                style={{
                  borderLeft: "4px solid #fd6900",
                  marginBottom: "10px",
                }}
              >
                <div className="row ">
                  <p className="col-6 text-14">
                    {t("items.type")} {price?.type}
                  </p>
                  <p className="col-6 text-14">
                    {t("items.price")} {price?.amount}/{price?.note}
                  </p>

                  <p className="col-6 text-14">
                    {t("items.min")} {price?.min_stay}
                  </p>
                  <p className="col-6 text-14">
                    {t("items.guest")} {price?.guest}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div>{t("items.no-price")}</div>
          )}
        </div>
      </section>
      <section className="layout-pb-sm">
        <Divider
          side="center"
          title={t("items.current-state")}
          className="my-1"
        />
        <div className="container">
          <div className="row x-gap-10 y-gap-10  justify-between items-center">
            {item?.contact?.length > 0 ? (
              item?.contact?.map((cnt, idx) => (
                <div className="col-4 text-16 text-dark-1 row " key={idx}>
                  <span className="fw-500">{cnt?.type}</span>
                  <span className="badge text-truncate">{cnt?.value}</span>
                </div>
              ))
            ) : (
              <div>no</div>
            )}
          </div>
        </div>
      </section>

      {session.role === roles.admin && (
        <div className="modal-footer">
          {item?.status !== "RENT" && (
            <button
              type="button"
              disabled={loading.recommended}
              onClick={() =>
                handleRecommended({
                  id: item?.id,
                  value: item?.isRecommended ? false : true,
                })
              }
              className="col-auto button -sm bg-blue-1 text-white"
            >
              {item?.isRecommended ? t("items.remove-from") : t("items.add-to")}
              {loading.recommended && (
                <Icon
                  icon={"line-md:loading-loop"}
                  className="ml-10"
                  width={15}
                  height={15}
                />
              )}
            </button>
          )}
          {!item?.status !== "RENT" && (
            <button
              type="button"
              disabled={loading.status}
              onClick={() =>
                handleStatus({
                  id: item?.id,
                  status:
                    item?.status === "AVAILABLE" ? "PENDING" : "AVAILABLE",
                })
              }
              className="col-auto button -sm bg-blue-1 text-white"
            >
              {item?.status === "AVAILABLE"
                ? t("items.available")
                : t("items.approve")}
              {loading.status && (
                <Icon
                  icon={"line-md:loading-loop"}
                  className="ml-10"
                  width={15}
                  height={15}
                />
              )}
            </button>
          )}
          {item?.status === "AVAILABLE" && (
            <button
              type="button"
              disabled={item?.status === "RENT" || loading.status}
              onClick={() =>
                handleStatus({
                  id: item?.id,
                  status: "RENT",
                })
              }
              className="col-auto button -sm bg-blue-1 text-white"
            >
              {item?.status === "RENT" ? t("items.rented") : t("items.rent")}
              {loading.status && (
                <Icon
                  icon={"line-md:loading-loop"}
                  className="ml-10"
                  width={15}
                  height={15}
                />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewDwelling;
