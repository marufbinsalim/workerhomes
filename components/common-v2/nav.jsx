"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const Dropdown = ({
  languageOptions,
  selected,
  setSelected,
  open,
  setOpen,
}) => {
  return (
    <div>
      {/* Dropdown menu */}
      {open && (
        <div className="tw:absolute tw:bottom-full tw:mb-4 tw:left-0 tw:md:bottom-auto tw:md:mb-0 tw:md:mt-4 tw:w-[275px] tw:bg-white tw:rounded-lg tw:p-5 tw:shadow-lg tw:z-10 tw:md:left-auto tw:-translate-x-[60vw] tw:md:-translate-x-[14vw]">
          {languageOptions.map((lang) => (
            <div
              key={lang.label}
              onClick={() => {
                setSelected(lang.label);
                setOpen(false);
              }}
              className="tw:flex tw:items-center tw:gap-[14px] tw:mt-2 tw:justify-between tw:mb-2 tw:cursor-pointer"
            >
              <div className="tw:flex tw:items-center tw:gap-3">
                <img
                  src={lang.flag}
                  alt={`${lang.label} flag`}
                  className="tw:w-[32px] tw:h-[22px] tw:rounded-sm"
                />
                <span className="tw-text-black tw:font-[14px]">
                  {lang.label}
                </span>
              </div>
              {selected === lang.label && (
                <Check className="tw-w-5 tw-h-5 tw-text-black" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("English");

  const languageOptions = [
    { label: "English", flag: "/assets/flag-uk.png", code: "en" },
    { label: "German", flag: "/assets/flag-de.png", code: "de" },
    { label: "Polish", flag: "/assets/flag-pl.png", code: "pl" },
  ];

  const toggleMenu = () => {
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
      setShouldRenderMenu(true);
      setTimeout(() => setIsMenuOpen(true), 10);
    } else {
      closeMenu();
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setTimeout(() => {
      setShouldRenderMenu(false);
    }, 300);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(scrollTop / docHeight, 1);

      const menu = document.getElementById("scroll-menu");
      if (menu) {
        const maxTranslate = 100;
        const currentTranslate = (1 - scrollPercent) * maxTranslate;
        menu.style.transform = `translateX(-${currentTranslate}%)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <div
        className={`
                tw:fixed tw:top-0 tw:left-0 tw:right-0 tw:z-40
                tw:flex tw:items-center tw:justify-between 
                tw:px-6 tw:py-2 tw:bg-white
                tw:transition-all tw:duration-300
                ${isScrolled ? "tw:shadow-md" : "tw:shadow-none"}
            `}
      >
        {/* Logo */}
        <div className="tw:md:px-8">
          <img
            src="/assets/logo.png"
            alt="workerhomes"
            className="tw:w-[200px] tw:h-[41px]"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="tw:hidden tw:md:flex tw:text-[var(--color-font-dark)] tw:font-normal tw:items-center tw:gap-6 tw:text-[14px]">
          <a
            href="#"
            className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium"
          >
            Home
          </a>
          <a
            href="#"
            className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium"
          >
            Pricing
          </a>
          <a
            href="#"
            className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium"
          >
            Bookmarks
          </a>
          <a
            href="#"
            className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium"
          >
            Blogs
          </a>
          <a
            href="#"
            className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium"
          >
            Contact
          </a>

          <button className="tw:relative tw:w-[150px] tw:h-[33px] tw:text-sm tw:font-medium tw:text-[var(--color-primary)] tw:bg-white tw:z-10 tw:overflow-hidden animated-border">
            List your property
          </button>
        </div>

        {/* Desktop Right Section */}
        <div className="tw:hidden tw:md:flex tw:items-center tw:gap-4">
          <button className="tw:bg-[#040342] tw:text-white tw:text-[14px] tw:w-[150px] tw:h-[33px] tw:text-sm tw:font-medium">
            Sign In / Register
          </button>

          {/* Language Selector */}
          <div className="tw:flex tw:items-center tw:gap-2">
            <img
              src={
                languageOptions.find((lang) => lang.label === selected)?.flag
              }
              alt="flag"
              className="tw:w-[32px] tw:h-[32px] tw:border tw:border-[var(--color-font-regular)] tw:rounded-full"
            />

            <div className="tw:relative">
              <img
                src="/assets/dropdown.png"
                alt="dropdown"
                className="tw:w-[13px] tw:h-[8px] tw:cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
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

        {/* Mobile Menu Button */}
        <button
          className="tw:md:hidden tw:p-2 tw:text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="tw:w-6 tw:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {shouldRenderMenu && (
        <AnimatePresence>
          <motion.div
            className="tw:fixed tw:inset-0 tw:z-50 tw:overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="tw:absolute tw:inset-0 tw:bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
            />

            {/* Menu Content */}
            <motion.div
              id="scroll-menu"
              className="tw:absolute font-primary tw:top-0 tw:left-0 tw:h-full tw:bg-white tw:shadow-xl tw:overflow-y-auto"
              style={{ width: "90vw", maxWidth: "90vw" }}
              initial={{ x: "-90vw" }}
              animate={{ x: isMenuOpen ? 0 : "-90vw" }}
              exit={{ x: "-90vw" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="tw:relative tw:border-b tw:border-[var(--color-border-light)] tw:pb-5 tw:px-4 tw:pt-5">
                {/* Logo */}
                <img
                  src="/assets/logo.png"
                  alt="workerhomes"
                  className="tw:w-[150px] tw:h-[30px]"
                />

                {/* Close Button */}
                <button
                  className="tw:absolute tw:top-4 tw:right-4 tw:p-2 tw:text-gray-700"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <svg
                    className="tw:w-6 tw:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Scrollable Menu Content */}
              <div className="tw:flex tw:flex-col tw:p-6 tw:space-y-6 tw:mt-4">
                <a
                  href="#"
                  className="tw:text-[var(--color-primary)] tw:text-lg"
                  onClick={closeMenu}
                >
                  Home
                </a>
                <a
                  href="#"
                  className="tw:text-[var(--color-primary)] tw:text-lg"
                  onClick={closeMenu}
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="tw:text-[var(--color-primary)] tw:text-lg"
                  onClick={closeMenu}
                >
                  Bookmarks
                </a>
                <a
                  href="#"
                  className="tw:text-[var(--color-primary)] tw:text-lg"
                  onClick={closeMenu}
                >
                  Blogs
                </a>
                <a
                  href="#"
                  className="tw:text-[var(--color-primary)] tw:text-lg"
                  onClick={closeMenu}
                >
                  Contact
                </a>

                <div className="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:cursor-pointer">
                  <span className="tw-text-[var(--color-font-dark)] tw-text-lg">
                    Change Language
                  </span>
                  <div className="tw:flex tw:items-center tw:gap-2">
                    <img
                      src={
                        languageOptions.find((lang) => lang.label === selected)
                          ?.flag
                      }
                      alt="flag"
                      className="tw:w-[32px] tw:h-[32px] tw:border tw:border-[var(--color-font-regular)] tw:rounded-full"
                    />
                    <div className="tw:relative">
                      {/* Trigger icon */}
                      <img
                        src="/assets/dropdown.png"
                        alt="dropdown"
                        className="tw:w-[13px] tw:h-[8px] tw:cursor-pointer"
                        onClick={() => setOpen((prev) => !prev)}
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

                <button className="tw:w-full tw:py-3 tw:mt-2  tw:relative  tw:text-lg tw:font-medium tw:text-[var(--color-primary)] tw:bg-white tw:z-10 tw:overflow-hidden animated-border">
                  List your property
                </button>

                <button className="tw:w-full tw:py-3 tw:text-lg tw:font-medium tw:text-white tw:bg-[#040342] ">
                  Sign In / Register
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default Navbar;
