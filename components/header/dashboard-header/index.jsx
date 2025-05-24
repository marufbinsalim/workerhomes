"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";
import { GoMoveToEnd } from "react-icons/go";
import { LuUser } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { signOut } from "next-auth/react";
import { getPageTitle } from "@/utils/navbarUtils";

const UserDropdown = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const locale = useParams().locale;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <div className="tw:relative font-secondary" ref={dropdownRef}>
      <button
        className="tw:flex tw:items-center tw:gap-2 tw:group tw:p-2 tw:rounded tw:hover:bg-gray-200 tw:transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        {/* User avatar and name */}
        <div className="tw:w-8 tw:h-8 tw:bg-orange-500 tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center tw:font-bold tw:text-sm">
          {getInitials(session.user.name)}
        </div>
        <span className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
          {session.user.name}
        </span>
        {/* Chevron icon - hidden by default, visible on hover */}
        <FiChevronDown
          className={`tw:w-6 tw:h-6 tw:text-gray-500 tw:transition-transform ${
            isOpen ? "tw:rotate-180" : ""
          } ${
            isOpen
              ? "tw:opacity-100"
              : "tw:opacity-0 tw:group-hover:opacity-100"
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="tw:absolute tw:top-full tw:right-0 tw:mt-2 tw:w-[174px] tw:bg-white tw:rounded tw:shadow-dropdown tw:z-50 tw:py-2"
          role="menu"
        >
          {/* Profile */}
          <div
            className="tw:flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:hover:bg-gray-100 tw:cursor-pointer"
            onClick={() => handleNavigation("/dashboard/me")}
          >
            <LuUser className="tw:w-6 tw:h-6 tw:text-[var(--color-font-dark)]" />
            <p className="tw:text-[14px] tw:my-auto tw:font-normal tw:text-[var(--color-font-dark)]">
              My profile
            </p>
          </div>

          {/* Logout */}
          <div
            onClick={async () => {
              await signOut({
                redirect: true,
                callbackUrl: `/${locale}`,
              });
            }}
            className="tw:flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:hover:bg-gray-100 tw:cursor-pointer"
          >
            <MdLogout className="tw:w-6 tw:h-6 tw:text-[var(--color-font-dark)]" />
            <p className="tw:text-[14px] tw:my-auto tw:font-normal tw:text-[var(--color-font-dark)]">
              Logout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const Dropdown = ({
  languageOptions,
  selected,
  setSelected,
  open,
  setOpen,
  isMobileView,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (locale) => {
    const exactPath = pathname.replace(/^\/[a-z]{2}/, "");
    router.push(`/${locale}${exactPath}`);
  };

  return (
    <div className="tw:relative">
      {/* Dropdown menu */}
      {open && (
        <div
          className={`
            tw:absolute 
            tw:w-[275px] 
            tw:bg-white 
            tw:rounded-lg 
            tw:shadow-lg 
            tw:z-50
            tw:p-4
            font-tertiary
            ${
              isMobileView
                ? "tw:right-0 tw:top-full tw:mt-2" // Mobile: appears below
                : "tw:right-0 tw:top-full tw:mt-2" // Desktop: appears below
            }
        `}
        >
          {languageOptions.map((lang) => (
            <div
              key={lang.label}
              onClick={() => {
                setSelected(lang.label);
                changeLocale(lang.code);
                setOpen(false);
              }}
              className="
                tw:flex 
                tw:items-center 
                tw:justify-between 
                tw:py-3 
                tw:px-3 
                tw:cursor-pointer 
                hover:tw:bg-gray-50
                tw:rounded-md
              "
            >
              <div className="tw:flex tw:items-center tw:gap-3">
                <img
                  src={lang.flag}
                  alt={`${lang.label} flag`}
                  className="tw:w-6 tw:h-4 tw:rounded-sm"
                />
                <span className="tw:text-sm tw:font-medium tw:text-gray-800">
                  {lang.label}
                </span>
              </div>
              {selected === lang.label && (
                <Check className="tw:w-4 tw:h-4 tw:text-blue-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = ({ session }) => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const t = useTranslations("header");
  const pathName = usePathname();
  const locale = pathName.split("/")[1];
  const [selected, setSelected] = useState(t(`locales.${locale}.language`));
  const router = useRouter();
  const [navbar, setNavbar] = useState(false);

  const params = useParams();

  const pageTitle = getPageTitle(pathName, locale);

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

  console.log("session : ", session);

  const languageOptions = [
    {
      id: 1,
      label: t("locales.en.language"),
      country: t("locales.en.country"),
      code: "en",
      flag: "/assets/flag-uk.png",
    },
    {
      id: 2,
      label: t("locales.de.language"),
      country: t("locales.de.country"),
      code: "de",
      flag: "/assets/flag-de.png",
    },
    {
      id: 3,
      label: t("locales.pl.language"),
      country: t("locales.pl.country"),
      code: "pl",
      flag: "/assets/flag-pl.png",
    },
  ];

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
      {/* Main Navbar */}
      <div className="font-primary tw:fixed tw:top-0 tw:left-0 tw:right-0 tw:bg-white tw:md:bg-transparent tw:z-40 tw:flex tw:items-center tw:justify-between tw:px-4 tw:md:px-6 tw:py-5">
        {/* Left side - menu button and logo */}
        <div className="tw:flex tw:items-center  tw:gap-2">
          {session && (
            <button className="tw:p-1" onClick={handleToggle}>
              <i className="icon-menu-2 tw:text-xl"></i>
            </button>
          )}

          {(isOpen || isMobileView) && (
            <div className="tw:px-2 tw:md:px-4 tw:mb-2 tw:lg:px-6">
              <img
                onClick={() => router.push(`/${locale}`)}
                src="/assets/logo.png"
                alt="logo"
                className="tw:w-[150px] tw:md:w-[160px] tw:lg:w-[200px] tw:h-auto tw:cursor-pointer"
              />
            </div>
          )}
          <h1 className="tw:text-xl tw:font-medium tw:my-auto tw:text-[var(--color-font-regular)] tw:ml-5">
            {pageTitle || "Dashboard"}
          </h1>
        </div>

        {/* Right side - desktop and mobile elements */}
        <div className="tw:flex tw:items-center tw:gap-4">
          {/* Mobile Language Selector (visible only on small screens) */}
          <div className="tw:flex tw:items-center tw:gap-2 tw:md:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              className="tw:flex tw:items-center tw:gap-1"
            >
              <img
                src={
                  languageOptions.find((lang) => lang.label === selected)?.flag
                }
                alt="flag"
                className="tw:w-7 tw:h-7 tw:rounded-full tw:border tw:border-gray-200"
              />
            </button>
            <div className="tw:relative">
              <img
                src="/assets/dropdown.png"
                alt="dropdown"
                className="tw:w-3 tw:lg:w-3.5 tw:h-2 tw:cursor-pointer"
                onClick={() => setOpen(!open)}
              />
              <div className="tw:absolute tw:top-full tw:left-0 tw:ml-2">
                <Dropdown
                  languageOptions={languageOptions}
                  selected={selected}
                  setSelected={setSelected}
                  open={open}
                  setOpen={setOpen}
                  isMobileView={isMobileView} // Add this prop
                />
              </div>
            </div>
          </div>

          {/* Desktop Right Section (hidden on mobile) */}
          <div className="tw:hidden tw:md:flex tw:items-center tw:gap-3 tw:lg:gap-4">
            {session?.user ? (
              <UserDropdown session={session} />
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="tw:bg-[#040342] tw:text-white tw:text-sm tw:lg:text-base tw:px-4 tw:py-1.5 tw:rounded tw:font-medium"
              >
                Sign In / Register
              </button>
            )}

            {/* Desktop Language Selector */}
            <div className="tw:flex tw:items-center tw:gap-1 tw:lg:gap-2">
              <img
                onClick={() => setOpen(!open)}
                src={
                  languageOptions.find((lang) => lang.label === selected)?.flag
                }
                alt="flag"
                className="tw:w-7 tw:lg:w-8 tw:h-7 tw:lg:h-8 tw:border tw:border-gray-300 tw:rounded-full tw:cursor-pointer"
              />
              <div className="tw:relative">
                <img
                  src="/assets/dropdown.png"
                  alt="dropdown"
                  className="tw:w-3 tw:lg:w-3.5 tw:h-2 tw:cursor-pointer"
                  onClick={() => setOpen(!open)}
                />
                <Dropdown
                  languageOptions={languageOptions}
                  selected={selected}
                  setSelected={setSelected}
                  open={open}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
