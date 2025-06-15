"use client";

import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import { api, url } from "@/config";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { create, createTrail } from "@/lib/services/subscription";
import useFetch from "@/hooks/useFetch";
import { useTranslations } from "next-intl";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutButton = ({ cartItems, title, className, dwellingId = "" }) => {
  const [loading, setLoading] = useState(false);
  const [trailLoading, setTrailLoading] = useState(false);
  const router = useRouter();
  const locale = useParams().locale;
  const t = useTranslations("checkout");
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const { data: subscriptions } = useFetch({
    url: "/api/subscriptions",
    keys: ["subscriptions"],
    query: {
      filters: { user: session?.id, isFree: true, dwellings: { $null: true } },
    },
  });

  const { data: currentUser, isLoading: userLoading } = useFetch({
    url: "/api/users/me",
    keys: ["users"],
  });

  const createQueryString = useCallback(
    (paramsObject) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsObject).forEach(([key, value]) =>
        value == null ? params.delete(key) : params.set(key, value)
      );
      return params.toString();
    },
    [searchParams]
  );

  const redirectToForm = (subscriptionId) => {
    router.push(
      `/${locale}/dashboard/dwellings/form?step=1&subscription=${subscriptionId}`
    );
  };

  const handleFreePlan = async () => {
    if (subscriptions?.length) return redirectToForm(subscriptions[0].id);

    const payload = {
      user: session?.id,
      stripe_customer_id: session?.stripe_customer_id || "",
      stripe_product_id: cartItems?.stripe_product_id || "",
      payment_status: "active",
      isFree: true,
      start_date: new Date(),
      package: cartItems?.id,
    };

    try {
      const res = await create(payload, t("free-success"));
      if ([200, 201].includes(res.status)) redirectToForm(res.data.data.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrailPlan = async () => {
    setTrailLoading(true);
    try {
      const res = await createTrail(
        { user: session?.id, package: cartItems?.id },
        t("trail-success")
      );
      if ([200, 201].includes(res.status))
        router.push(`/${locale}/dashboard/dwellings/`);
    } catch (error) {
      console.error(error);
    } finally {
      setTrailLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!session?.id) return router.push("/auth/signin");

    setLoading(true);
    try {
      if (cartItems?.isFree) return await handleFreePlan();

      const stripe = await stripePromise;
      const { data: userData } = await axios.get(`${api}/api/users/me`);
      const res = await axios.post(`${url}/api/checkout`, {
        item: cartItems,
        user: session?.stripe_customer_id,
        dwelling: dwellingId,
        locale,
        methods: userData?.paymentMethod,
      });

      const result = await stripe?.redirectToCheckout({
        sessionId: res?.data?.id,
      });
      if (result?.error) console.error(result.error.message);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderTrailButton = () =>
    !cartItems?.isFree &&
    !currentUser?.isFreeTrailUsed &&
    !userLoading && (
      <span
        onClick={handleCreateTrailPlan}
        className="text-sm text-brand pointer"
      >
        {trailLoading ? t("process") : t("trail")}
      </span>
    );

  return (
    <div>
      {renderTrailButton()}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`tw:w-full md:w-[240px]
            tw:h-[38px]
            tw:flex 
            tw:items-center 
            tw:justify-center 
            tw:gap-[10px] 
            tw:py-[10px] 
            tw:px-[25px] 
            tw:border-2 
            tw:border-[var(--color-brand-secondary)]
            tw:font-semibold 
            tw:mb-4 
            tw:text-[14px]
            tw:transition-colors 
            tw:bg-white 
            tw:text-[var(--color-brand-secondary)]
            tw:hover:bg-[var(--color-brand-secondary)]
            tw:hover:text-white" ${className}`}
      >
        <span className="ltr:pr-5 rtl:pl-5 -mt-0.5 py-0.5">
          {loading ? t("process") : title}
        </span>
      </button>
    </div>
  );
};

export default CheckoutButton;
