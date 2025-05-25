import { url } from "@/config";
import axios from "axios";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

const CustomerCard = ({ customer, locale }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = useTranslations("payment-card");

  const handleSetupCustomerPortal = async () => {
    try {
      const { data } = await axios.post(`${url}/api/stripe/portal`, {
        customerId: customer,
        redirectUrl: `${url}/${locale}/dashboard/me`,
      });

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create portal session:", data.error);
        setError(t("unable"));
      }
    } catch (err) {
      console.error(err.message);
      setError(t("failed"));
    }
  };

  const getCustomer = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${url}/api/stripe/customer/${customer}`,
      );
      setData(data);
    } catch (err) {
      console.error(err.message);
      setError(t("retrieve-error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomer();
  }, []);

  const renderPaymentDetails = () => {
    const { payment_method: paymentMethod } = data || {};

    if (!paymentMethod) {
      return <p className="tw:text-gray-700">{t("no-method")}</p>;
    }

    const { type, card, paypal, link } = paymentMethod;

    if (type === "card" && card) {
      return (
        <>
          <p className="tw:flex tw:justify-between tw:items-center tw:text-gray-700 tw:mb-2">
            <strong>{t("type")}</strong> Card
          </p>
          <p className="tw:flex tw:justify-between tw:items-center tw:text-gray-700 tw:mb-2">
            <strong>{t("brand")}</strong> {card?.brand?.toUpperCase()}
          </p>
          <p className="tw:flex tw:justify-between tw:items-center tw:text-gray-700 tw:mb-2">
            <strong>{t("last4")}</strong> **** **** **** {card?.last4}
          </p>
          <p className="tw:flex tw:justify-between tw:items-center tw:text-gray-700">
            <strong>{t("expiry")}</strong> {card?.exp_month}/{card?.exp_year}
          </p>
        </>
      );
    }

    if (type === "paypal" && paypal) {
      return (
        <>
          <p className="tw:flex tw:justify-between tw:items-center tw:text-gray-700 tw:mb-2">
            <strong>{t("type")}</strong> PayPal
          </p>
          <p className="tw:flex tw:justify-between tw:items-center tw:text-gray-700">
            <strong>{t("email")}</strong> {paypal?.email || "N/A"}
          </p>
        </>
      );
    }

    if (type === "link" && link) {
      return (
        <>
          <p className="tw:flex tw:justify-between tw:items-center tw:text-gray-700 tw:mb-2">
            <strong>{t("type")}</strong> Link
          </p>
          <p className="tw:flex tw:justify-between tw:items-center tw:text-gray-700">
            <strong>{t("email")}</strong> {link?.email || "N/A"}
          </p>
        </>
      );
    }

    return <p className="tw:text-gray-700">{t("un-support")}</p>;
  };

  return (
    <div className="tw:flex tw:flex-col tw:gap-4 tw:w-full tw:border tw:border-[#D8E0ED] tw:p-4 tw:mt-8 ">
      <h2 className="tw:text-lg tw:font-semibold tw:mb-4 tw:pb-4 tw:border-b tw:border-b-gray-200 tw:text-[var(--color-font-regular)]">
        Payment Details:
      </h2>
      <div className="tw:bg-[#FAFBFC] border border-[#D8E0ED] tw:p-6 tw:rounded-lg tw:shadow-sm tw:min-w-[70dvw] tw:md:min-w-[400px] tw:max-w-[400px]">
        {loading ? (
          <p className="tw:text-center tw:text-gray-700 tw:mt-4">
            {t("loading")}
          </p>
        ) : error ? (
          <div className="tw:text-red-500 tw:text-center tw:mt-4">{error}</div>
        ) : (
          <div>{renderPaymentDetails()}</div>
        )}
      </div>
      <div>
        {!loading && (
          <button
            className=" tw:bg-orange-500 tw:text-white tw:px-4 tw:py-2 tw:mt-2 tw:rounded tw:w-max tw:font-medium tw:disabled:opacity-50 tw:flex tw:items-center justify-center"
            onClick={handleSetupCustomerPortal}
            disabled={loading}
          >
            <Edit className="tw-inline tw:mr-2" />
            {data?.payment_method ? t("update") : t("setup")}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerCard;
