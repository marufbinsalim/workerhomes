"use client";

import DwellingCard from "@/components/common/card/dwelling-card";
import { useBookmarks } from "@/context/BookmarkProvider";
import { useTranslations } from "next-intl";
import HotelProperties from "@/components/hotel-list/hotel-list-v3/HotelProperties";

const BookmarkPage = ({ session }) => {
  const t = useTranslations("bookmark");
  const { items, totalBookmarks } = useBookmarks();

  console.log("items", items);
  console.log("totalBookmarks", totalBookmarks);

  return (
    <>
      <div className="header-margin" />
      {/* header top margin */}
      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{t("title")}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t("description")}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`row ${
              totalBookmarks > 0 ? "justify-start" : "justify-center"
            } items-center mt-4 x-gap-10 y-gap-10`}
          >
            {items?.data?.length > 0 ? (
              <div className="row y-gap-20 pt-20">
                <HotelProperties
                  data={items?.data?.map((item) => item?.dwelling)}
                  isLoading={false}
                />
              </div>
            ) : (
              <div className="col-auto text-center mt-40">
                <h6>{t("message.empty")}</h6>
                <p>{t("message.empty2")}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* End title */}
    </>
  );
};

export default BookmarkPage;
