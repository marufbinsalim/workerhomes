import { useTranslations } from "next-intl";

export const getPageTitle = (pathname, locale = 'en') => {
    if (!pathname) return "Dashboard";

    const path = pathname.replace(`/${locale}`, "") || "/";
    const t = useTranslations("navbarTitle");

    const titleMap = {
        "/dashboard/me": (t("profile")),
        "/dashboard/statistics": (t("statistics")),
        "/dashboard/invoices": (t("invoices")),
        "/dashboard/messenger": (t("messages")),
        "/dashboard/dwellings" : (t("listings")),
    };

    return titleMap[path] || "Dashboard";
  };
