"use client";

import Link from "@/components/common/Link";
import { useEffect, useState } from "react";
import MainMenu from "../MainMenu";
import CurrenctyMegaMenu from "../CurrenctyMegaMenu";
import LanguageMegaMenu from "../LanguageMegaMenu";
import HeaderSearch from "../HeaderSearch";
import MobileMenu from "../MobileMenu";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { brand, roles } from "@/config";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { exactPath } from "@/utils";

const Header1 = ({ user }) => {
  const locale = useParams().locale;
  const t = useTranslations("header");
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <>
      <header className={`header bg-white ${navbar ? "is-sticky" : ""}`}>
        <div className="header__container px-30 sm:px-20">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <Link href={`/`} className="header-logo mr-20">
                  {/* <Image src={exactPath(brand.logo.light)} alt='logo icon' /> */}
                  <Image
                    src={exactPath(brand.logo.light)}
                    alt="logo icon"
                    width={200}
                    height={30}
                  />
                </Link>
                {/* End logo */}

                {/* End header-menu */}
              </div>
              {/* End d-flex */}
            </div>
            {/* End col */}

            <div className="col-auto">
              <div className="header-menu">
                <div className="header-menu__content">
                  <MainMenu style="text-dark-1" />
                </div>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="row x-gap-20 items-center xl:d-none">
                  {/* <CurrenctyMegaMenu textClass='text-dark-1' /> */}
                  {/* End Megamenu for Currencty */}

                  {/* Start vertical devider*/}
                  <div className="col-auto">
                    <div className="w-1 h-20 bg-white-20" />
                  </div>
                  {/* End vertical devider*/}

                  <LanguageMegaMenu textClass="text-dark-1" />
                  {/* End Megamenu for Language */}
                </div>
                {/* End language and currency selector */}

                {/* Start btn-group */}
                <div className="d-flex items-center ml-20 is-menu-opened-hide md:d-none">
                  {!user?.id && (
                    <Link
                      href={`/login`}
                      className="button px-30 fw-400 text-14 -blue-1 bg-blue-1 h-50 text-white"
                    >
                      {t("button.sign")}
                    </Link>
                  )}
                  {user && (
                    <div className="pl-15 d-flex justify-content-between align-items-center">
                      <Link href="/dashboard/dwellings">
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
                      </Link>
                    </div>
                  )}
                </div>
                {/* End btn-group */}

                {/* Start mobile menu icon */}
                <div className="d-none xl:d-flex x-gap-20 items-center pl-30 text-dark-1">
                  <div>
                    <button
                      className="d-flex items-center icon-menu text-inherit text-20"
                      data-bs-toggle="offcanvas"
                      aria-controls="mobile-sidebar_menu"
                      data-bs-target="#mobile-sidebar_menu"
                    />

                    <div
                      className="offcanvas offcanvas-start  mobile_menu-contnet"
                      tabIndex="-1"
                      id="mobile-sidebar_menu"
                      aria-labelledby="offcanvasMenuLabel"
                      data-bs-scroll="true"
                    >
                      <MobileMenu user={user} />
                      {/* End MobileMenu */}
                    </div>
                  </div>
                </div>
                {/* End mobile menu icon */}
              </div>
            </div>
            {/* End col-auto */}
          </div>
          {/* End .row */}
        </div>
        {/* End header_container */}
      </header>
      {/* End Header */}
    </>
  );
};

export default Header1;
