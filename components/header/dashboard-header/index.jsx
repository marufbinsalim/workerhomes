"use client";

import Link from "@/components/common/Link";
import SubscriptionOptions from "@/components/common/SubscriptionOptions";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import LanguageMegaMenu from "../LanguageMegaMenu";
import MobileMenu from "../MobileMenu";
import { api, brand } from "@/config";
import Image from "next/image";
import { exactPath } from "@/utils";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import CustomerNotification from "@/components/common/customerNotification";

const HeaderDashBoard = ({ user }) => {
  const locale = useParams().locale;
  const [navbar, setNavbar] = useState(false);

  const pathName = usePathname();

  const [isOpen, setIsOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const t = useTranslations("header");

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    if (isMobileView) {
      console.log("pathName", pathName);
      setIsOpen(true);
    }
  }, [pathName]);

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    const body = document.querySelector("body");
    if (!isOpen) {
      body.classList.add("-is-sidebar-open");
    } else {
      body.classList.remove("-is-sidebar-open");
    }
  }, [isOpen]);

  return (
    <>
      <header
        className={`header -dashboard ${navbar ? "is-sticky bg-white" : ""}`}
      >
        <div className="header__container px-30 sm:px-20">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                {user && (
                  <button className="d-flex" onClick={handleToggle}>
                    <i className="icon-menu-2 text-20"></i>
                  </button>
                )}

                <div className="ml-30">
                  <Link href="/" className="header-logo">
                    <Image
                      src={exactPath(brand.logo.light)}
                      alt="logo icon"
                      width={200}
                      height={30}
                    />
                  </Link>
                </div>
              </div>
            </div>
            {/* End .col-auto */}

            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="row x-gap-20 items-center ">
                  <div className="col-auto">
                    <div className="w-1 h-20 bg-white-20" />
                  </div>

                  <LanguageMegaMenu textClass="text-dark-1" />
                </div>

                <div className="px-15 d-flex justify-content-between align-items-center lg:d-none">
                  <span className="pr-15">
                    {user?.user?.name ? user?.user?.name : "Anonymous"}
                    <br />
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: "5px",
                        color: "orange",
                        fontSize: "0.7rem",
                      }}
                    >
                      <Icon icon="lets-icons:message-duotone" />
                      {user?.user?.email ? user?.user?.email : "N/A"}
                    </span>
                  </span>

                  <div className="col-auto">
                    <button
                      className="button -sm -dark-1 bg-blue-1 text-white col-auto"
                      onClick={async () => {
                        await signOut({
                          redirect: true,
                          callbackUrl: `/${locale}`,
                        });

                        // Clear cookies
                        document.cookie =
                          "next-auth.session-token=; Max-Age=0; path=/";
                        document.cookie =
                          "__Secure-next-auth.session-token=; Max-Age=0; path=/; Secure";

                        // Clear localStorage
                        localStorage.removeItem("next-auth.session-token");
                      }}
                    >
                      {t("button.sign-out")}
                      <Icon
                        icon="solar:logout-3-outline"
                        className="ml-15"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>

                  {/* {user?.user?.image ? (
                    <Image
                      width={25}
                      height={25}
                      src={
                        user?.user?.image
                          ? api + user?.user?.image
                          : '/img/general/avatar.png'
                      }
                      alt='image'
                      className='size-30 rounded-22 object-cover ml-10'
                    />
                  ) : null} */}
                </div>

                {!user?.id && (
                  <div className="d-none xl:d-flex x-gap-20 items-center pl-20">
                    <div>
                      <button
                        className="d-flex items-center icon-menu text-20"
                        data-bs-toggle="offcanvas"
                        aria-controls="mobile-sidebar_menu"
                        data-bs-target="#mobile-sidebar_menu"
                      ></button>
                    </div>

                    <div
                      className="offcanvas offcanvas-start  mobile_menu-contnet "
                      tabIndex="-1"
                      id="mobile-sidebar_menu"
                      aria-labelledby="offcanvasMenuLabel"
                      data-bs-scroll="true"
                    >
                      <MobileMenu />
                    </div>
                  </div>
                )}
              </div>
              {/* End -flex items-center */}
            </div>
            {/* End col-auto */}
          </div>
          {/* End .row */}
        </div>
        {/* End header_container */}
      </header>
      {/* End header */}
    </>
  );
};

export default HeaderDashBoard;
