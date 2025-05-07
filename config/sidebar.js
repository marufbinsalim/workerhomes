import useMessenger from "@/hooks/useMessenger";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const adminSidebarContent = (locale, t, unreadCount) => [
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
    name: t("messenger") + ` (${unreadCount})`,
    routePath: `/${locale}/dashboard/messenger`,
  },
];

const hasPermission = (permissions, action, path, userRoles) => {
  const pathWithOutLocale = path.replace(/\/\w{2}/, "");
  return permissions[action]?.[pathWithOutLocale]?.some((role) =>
    userRoles.includes(role)
  );
};

export const filterSidebarContent = (
  locale,
  t,
  permissions,
  userRoles,
  session
) => {
  const checkPermission = (routePath) => {
    const action = "read";
    return hasPermission(permissions, action, routePath, userRoles);
  };

  const [unreadCount, setUnreadCount] = useState(0);
  const [threads, setThreads] = useState([]);

  function generateThreadType(thread) {
    if (!thread) return null;

    return {
      thread_id: thread.thread_id,
      user: thread.user,
      owner: thread.owner,
      name:
        session?.user.email === thread.user.email
          ? thread.owner.username
          : thread.user.username,
      lastMessage: thread.last_message?.content,
      lastMessageSender: thread.last_message?.sender?.email,
      lastMessageTime: thread.last_message?.timestamp,
      status:
        session?.user.email === thread?.last_message?.sender?.email
          ? thread.seen
            ? "seen by recipient"
            : "sent"
          : thread.seen
          ? "seen by you"
          : "unread",
    };
  }

  useEffect(() => {
    const threadsListener = supabase
      .channel("public:threads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "threads" },
        (payload) => {
          let currentThreads = [...threads];
          if (payload.eventType === "INSERT") {
            currentThreads = [payload.new, ...currentThreads];
          } else if (payload.eventType === "UPDATE") {
            const index = currentThreads.findIndex(
              (thread) => thread.thread_id === payload.new.thread_id
            );
            currentThreads[index] = payload.new;
          } else if (payload.eventType === "DELETE") {
            currentThreads = currentThreads.filter(
              (thread) => thread.thread_id !== payload.old.thread_id
            );
          }
          setThreads(currentThreads);
        }
      )
      .subscribe();

    return () => {
      threadsListener.unsubscribe();
    };
  }, [threads]);

  useEffect(() => {
    async function fetchThreads() {
      const { data } = await supabase.from("threads").select("*");
      setThreads(data);
    }
    fetchThreads();
  }, []);

  useEffect(() => {
    if (threads && threads.length > 0) {
      const unread = threads.map(generateThreadType).filter((thread) => {
        return (
          thread.status === "unread" &&
          thread.lastMessageSender !== session?.user.email &&
          (session?.user.email === thread.user.email ||
            session?.user.email === thread.owner.email)
        );
      });
      setUnreadCount(unread?.length || 0);
    }
  }, [threads]);

  const filteredContent = adminSidebarContent(locale, t, unreadCount)
    .map((item) => {
      if (!checkPermission(item.routePath)) {
        return null;
      }

      if (item.submenu) {
        item.submenu = item.submenu.filter((subItem) =>
          checkPermission(subItem.routePath)
        );
      }

      return item;
    })
    .filter(Boolean);

  return filteredContent;
};
