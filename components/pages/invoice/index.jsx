"use client";

import ControlPanel from "@/components/common/controlPanel";
import Table from "@/components/common/table";
import { formatDate } from "@/utils";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        <span>
          {item?.period_start
            ? formatDate(moment(item?.period_start * 1000), false, locale)
            : "N/A"}
        </span>
      ),
    },
    {
      Header: t("table.name"),
      Cell: (item) => (
        <span>
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
        <span className="text-brand">
          {item?.amount_paid ? item?.amount_paid / 100 : 0}{" "}
          <span className="uppercase">{item?.currency}</span>
        </span>
      ),
    },
    {
      Header: t("table.action"),
      Cell: (item) => (
        <Link
          href={item.hosted_invoice_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("table.download")}
        </Link>
      ),
    },
  ];
  return (
    <>
      <ControlPanel
        title={t("title")}
        // description={t('description')}
        isSearchable={false}
        breadcrumbs={[
          t("control-panel.breadcrumb.1"),
          t("control-panel.breadcrumb.2"),
        ]}
      />

      <div className="tw:bg-red-500 tw:rounded-lg tw:min-h-[calc(100dvh-70px)] tw:max-h-[calc(100dvh-70px)] tw:p-6 tw:flex tw:flex-col">
        <Table isLoading={loading} data={invoices || []} columns={columns} />
      </div>
    </>
  );
};

export default InvoicePage;
