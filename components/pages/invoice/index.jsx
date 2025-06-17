"use client";

import ControlPanel from "@/components/common/controlPanel";
import Table from "@/components/common/table";
import { formatDate } from "@/utils";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";

const InvoicePage = ({ locale }) => {
  const t = useTranslations("invoice");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  const customerId = session?.stripe_customer_id;

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/stripe/invoices/${customerId}`);

      const data = await response.json();

      setInvoices(data?.data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchInvoices();
    }
  }, [customerId]);

  const columns = [
    {
      Header: t("table.date"),
      Cell: (item) => (
        <span className="tw:text-sm tw:ml-1 tw:font-normal tw:text-[var(--color-font-dark)]">
          {item?.period_start
            ? formatDate(moment(item?.period_start * 1000), false, locale)
            : "N/A"}
        </span>
      ),
    },
    {
      Header: "Name",
      Cell: (item) => {
        // Handle empty/null/undefined title cases
        const displayTitle = item?.title?.trim(); // Remove whitespace if exists
        console.log("Display Title:", displayTitle);
        return (
          <span className="tw:text-sm tw:font-normal tw:ml-1 tw:text-[var(--color-font-dark)]">
            {displayTitle && displayTitle.length > 0
              ? (displayTitle.length > 20
                ? `${displayTitle.slice(0, 20)}...`
                : displayTitle)
              : 'N/A'}
          </span>
        );
      },
    },

    {
      Header: "Package Name",
      Cell: (item) => (
        <span className="tw:text-sm tw:font-normal tw:ml-1 tw:text-[var(--color-font-dark)]">
          {item?.lines?.map((lineItem) => (
            <p key={lineItem.id} className="text-brand">
              {lineItem.price.product.name}
            </p>
          ))}
        </span>
      ),
    },
    {
      Header: t("table.cost"),
      Cell: (item) => (
        <span className="text-brand tw:ml-1 tw:text-sm tw:font-normal tw:text-[var(--color-font-dark)]">
          {item?.amount_paid ? item?.amount_paid / 100 : 0}{" "}
          <span className="uppercase">{item?.currency}</span>
        </span>
      ),
    },
    {
      Header: t("table.action"),
      align: "right",
      Cell: (item) => (
        <Link
          href={item.hosted_invoice_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiDownload size={24} className="tw:right-0"/>
        </Link>
      ),
    },
  ];
  return (
    <>
      {/* <ControlPanel
        title={t("title")}
        description={t('description')}
        isSearchable={false}
        breadcrumbs={[
          t("control-panel.breadcrumb.1"),
          t("control-panel.breadcrumb.2"),
        ]}
      /> */}

      <div className=" tw:rounded-lg tw:min-h-[calc(100dvh-70px)]  tw:mt-12 tw:max-h-[calc(100dvh-70px)] tw:md:p-4 tw:gap-[30px] tw:flex tw:flex-col">
        <Table isLoading={loading} data={invoices || []} columns={columns}
          emptyState={
            <div className="tw:h-full tw:flex tw:flex-col tw:bg0 tw:items-center tw:justify-center tw:gap-4 tw:p-8">
              <img
                src="/assets/invoiceNotFound.png"
                alt="No invoices"
                className="tw:w-[300px] tw:h-[300px] tw:object-contain"
              />
              <div className="tw:text-center font-secondary">
                <h3 className="tw:text-[24px] tw:font-medium tw:text-[var(--color-font-dark)] tw:mb-2">
                  {t("noInvoicesFound")}
                </h3>
                <p className="tw:text-[var(--color-font-regular)] tw:text-[16px] tw:font-normal">
                  {t("noInvoicesFoundDescription")}
                </p>
              </div>
            </div>
        }
        />
      </div>
    </>
  );
};

export default InvoicePage;
