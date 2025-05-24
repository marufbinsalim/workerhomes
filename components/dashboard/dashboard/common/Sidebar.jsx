"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import permissions from "@/config/permissions";
import { filterSidebarContent } from "@/config/sidebar";
import { isActiveLink } from "@/utils/linkActiveChecker";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import { PiChartLineUpBold } from "react-icons/pi";
import { createClient } from "@supabase/supabase-js";
import { CircleDashed } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const Sidebar = () => {
  const locale = useParams().locale;
  const t = useTranslations("dashboard-sidebar");
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const [isPending, startTransition] = useTransition();
  const isMessengerPage = pathname.includes("/messenger");
  const [open, setOpen] = useState(isMessengerPage ? 0 : 1);
  const [clickedId, setClickedId] = useState(null);

  const sidebarContent = filterSidebarContent(
    locale,
    t,
    permissions,
    data?.role,
    data,
  );

  const handleItemClick = (item) => {
    setClickedId(item.id);
    setOpen(item.id);

    startTransition(() => {
      router.push(item.routePath);
    });
  };

  return (
    <div className="tw:space-y-2 font-secondary">
      {sidebarContent.map((item) => {
        const isActive = clickedId === item.id ||
          (!isPending && isActiveLink(item.routePath, pathname));

        return (
          <div key={item.id}>
            <div
              className={`tw:w-[270px] tw:h-[64px] tw:gap-[16px] tw:font-normal tw:text-[var(--color-font-dark)] tw:p-[20px] tw:cursor-pointer ${isActive || (item?.submenu && open === item.id)
                  ? "tw:border-2 tw:border-[var(--color-primary)] tw:font-semibold tw:text-[var(--color-primary)]"
                  : ""
                } ${isPending && clickedId === item.id ? "tw:opacity-70" : ""
                }`}
              onClick={() => handleItemClick(item)}
            >
              <div className="tw:flex tw:items-center tw:justify-between tw:text-[15px] tw:leading-[1] tw:w-full">
                <div className="tw:flex tw:items-center">
                  <item.icon className="tw:w-5 tw:h-5 tw:mr-[15px]" />
                  {item.name}
                </div>
                {isPending && clickedId === item.id ? (
                  <CircleDashed
                    className="tw:animate-spin"
                    color="var(--color-primary)"
                    width={20}
                    height={20}
                  />
                ) : item.submenu?.length > 0 ? (
                  <Icon
                    icon={
                      open === item.id
                        ? "icon-park-outline:down"
                        : "icon-park-outline:right"
                    }
                    width={20}
                    height={20}
                  />
                ) : null}
              </div>
            </div>
            {item.submenu && (
              <SubMenuItem
                open={open === item.id}
                items={item.submenu}
                pathname={pathname}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const SubMenuItem = ({ open, items, pathname }) => {
  return (
    <div className={`sidebar__submenu${open ? "--active" : ""} tw:w-full`}>
      <div className="sidebar__submenu__content">
        {items?.length > 0 &&
          items?.map((item, i) => (
            <Link
              key={i}
              href={item.routePath}
              className={`sidebar__submenu__content__item text-15 lh-1 fw-500 ${isActiveLink(item.routePath, pathname)
                  ? "submenu__item__active"
                  : ""
                }`}
            >
              <Icon icon={item?.icon} width={16} height={16} />
              {item.name}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;