import PackageSelectCard from "@/components/common/card/PackageSelectCard";
import Checkbox from "@/components/common/Checkbox";
import ComboBox from "@/components/common/ComboBox";
import SubscriptionPlans from "@/components/common/subscription";
import SubscriptionOptions from "@/components/common/SubscriptionOptions";
import { api, url } from "@/config";
import useFetch from "@/hooks/useFetch";
import { create } from "@/lib/services/subscription";
import { stripe } from "@/lib/stripe";
import { initPayment, paymentSchema } from "@/lib/validation/dwelling/payment";
import { Icon } from "@iconify/react";
import axios from "axios";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParam } from "react-use";

const DwellingPaymentForm = ({
  formData,
  user,
  onSuccess,
  hasSubscriptions,
}) => {
  const [session, setSession] = useState(null);
  const t = useTranslations("dwellings");
  const [buying, setBuying] = useState(false);

  const sessionId = useSearchParam("subscription");

  const res = async () => {
    try {
      if (sessionId) {
        const { data } = await fetch(
          `${url}/api/stripe/session/${sessionId}`
        ).then((res) => res.json());
        setSession(data);

        if (data?.id && data?.status === "complete") {
          await axios.put(`${api}/api/assign-dwelling`, {
            data: {
              session: data,
            },
          });

          onSuccess && onSuccess();
        }
      }
    } catch (error) {
      console.error(error);
      // onSuccess && onSuccess()
    }
  };
  useEffect(() => {
    res();
  }, [sessionId]);

  const { data, isLoading } = useFetch({
    url: "/api/packages",
    keys: ["packages"],
    query: {
      filters: {
        isFree: {
          $eq: true,
        },
        price: {
          $eq: 0,
        },
      },
    },
  });

  const handleFreePlan = async () => {
    if (hasSubscriptions) {
      onSuccess && onSuccess();
      return;
    }

    setBuying(true);

    const formattedValues = {
      user: user?.id,
      stripe_customer_id: user?.stripe_customer_id || "",
      stripe_product_id: data?.[0]?.stripe_product_id || "",
      payment_status: "active",
      isFree: true,
      start_date: new Date(),
      package: data?.[0]?.id,
    };

    const res = await create(
      formattedValues,
      "Free Plan created successfully."
    );

    if (res.status === 200 || res.status === 201) {
      onSuccess && onSuccess();
    }

    setBuying(false);
  };

  if (isLoading) return <div>{t("messages.loading")}</div>;

  return (
    <div className="">
      {sessionId ? (
        <div
          className="w-100 border bg-success text-white"
          style={{
            padding: "10px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {session?.id && session?.status === "complete"
            ? "Payment successful"
            : "Payment failed"}
        </div>
      ) : (
        <SubscriptionPlans
          packageId={formData?.package?.id}
          isForm={true}
          dwellingId={formData?.id}
        />
      )}
    </div>
  );
};

export default DwellingPaymentForm;
