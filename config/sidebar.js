const adminSidebarContent = (locale, t) => [
  {
    id: 1,
    icon: "mage:dashboard-minus",
    name: t("dashboard"),
    routePath: `/${locale}/dashboard`,
  },
  {
    id: 11,
    icon: "wpf:statistics",
    name: t("statistics"),
    routePath: `/${locale}/dashboard/statistics`,
  },
  {
    id: 2,
    icon: "solar:home-broken",
    name: t("dwellings"),
    routePath: `/${locale}/dashboard/dwellings`,
    submenu: [
      {
        id: 1,
        name: t("dwelling-equipments"),
        icon: "fluent:spatula-spoon-28-regular",
        routePath: `/${locale}/dashboard/dwellings/equipments`,
      },
      {
        id: 2,
        name: t("dwelling-categories"),
        icon: "carbon:category-new-each",
        routePath: `/${locale}/dashboard/dwellings/categories`,
      },
      // {
      //   id: 3,
      //   name: t('dwelling-galleries'),
      //   icon: 'prime:images',
      //   routePath: `/${locale}/dashboard/dwellings/galleries`,
      // },
      {
        id: 5,
        name: t("dwelling-guidelines"),
        icon: "basil:document-outline",
        routePath: `/${locale}/dashboard/dwellings/guidelines`,
      },
      {
        id: 6,
        name: t("dwelling-amenities"),
        icon: "la:swimming-pool",
        routePath: `/${locale}/dashboard/dwellings/amenities`,
      },
    ],
  },
  {
    id: 4,
    icon: "mingcute:location-line",
    name: t("locations"),
    routePath: `/${locale}/dashboard/locations`,
    // submenu: [
    //   {
    //     id: 1,
    //     name: t('location-countries'),
    //     icon: 'material-symbols-light:rate-review-outline-rounded',
    //     routePath: `/${locale}/dashboard/locations/countries`,
    //   },
    // ],
  },
  {
    id: 5,
    icon: "carbon:blog",
    name: t("blogs"),
    routePath: `/${locale}/dashboard/blog`,
    submenu: [
      {
        id: 1,
        name: t("blog-categories"),
        icon: "carbon:category-new-each",
        routePath: `/${locale}/dashboard/blog/categories`,
      },
      // {
      //   id: 2,
      //   name: t('blog-comments'),
      //   icon: 'iconamoon:comment',
      //   routePath: `/${locale}/dashboard/blog/comments`,
      // },
    ],
  },
  {
    id: 6,
    icon: "iconoir:packages",
    name: t("packages"),
    routePath: `/${locale}/dashboard/packages`,
  },
  {
    id: 7,
    icon: "streamline:subscription-cashflow",
    name: t("subscription"),
    routePath: `/${locale}/dashboard/subscriptions`,
  },
  {
    id: 8,
    icon: "heroicons:users",
    name: t("users"),
    routePath: `/${locale}/dashboard/users`,
  },
  {
    id: 9,
    icon: "iconamoon:profile-light",
    name: t("profile"),
    routePath: `/${locale}/dashboard/me`,
  },

  {
    id: 10,
    icon: "ph:invoice-duotone",
    name: t("invoice"),
    routePath: `/${locale}/dashboard/invoices`,
  },

  {
    id: 100,
    icon: "ph:chat",
    name:
      t("messenger") +
      ` (${localStorage.getItem("unreadThreads") ? localStorage.getItem("unreadThreads") : "0"})`,
    routePath: `/${locale}/dashboard/messenger`,
  },
];

const hasPermission = (permissions, action, path, userRoles) => {
  const pathWithOutLocale = path.replace(/\/\w{2}/, "");
  return permissions[action]?.[pathWithOutLocale]?.some((role) =>
    userRoles.includes(role),
  );
};

export const filterSidebarContent = (locale, t, permissions, userRoles) => {
  const checkPermission = (routePath) => {
    const action = "read";
    return hasPermission(permissions, action, routePath, userRoles);
  };

  const filteredContent = adminSidebarContent(locale, t)
    .map((item) => {
      if (!checkPermission(item.routePath)) {
        return null;
      }

      if (item.submenu) {
        item.submenu = item.submenu.filter((subItem) =>
          checkPermission(subItem.routePath),
        );
      }

      return item;
    })
    .filter(Boolean);

  return filteredContent;
};
