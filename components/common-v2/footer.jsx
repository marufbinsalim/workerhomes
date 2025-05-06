import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <div className="tw:bg-[#F7F7F7] font-primary tw:text-gray-800 tw:py-8 ">
      <div className="tw:max-w-8xl tw:px-10 tw:md:px-20 tw:mx-auto">
        <img
          src="/assets/logo.png"
          alt="workerhomes"
          className="tw:w-[200px] tw:h-[41px] tw:mb-[30px]"
        />
        <div className="tw:flex tw:flex-col tw:lg:flex-row tw:items-start tw:justify-between tw:gap-8">
          <div className="tw:lg:w-1/4 tw:w-full ">
            <p className="tw:mb-[30px] tw:w-[345px] tw:text-[18px] tw:leading-[24px]  tw:text-[var(--color-font-dark)] tw:font-medium">
              {t("about")}
            </p>

            <div className="tw:space-y-2">
              <div>
                <h3 className="tw:font-semibold tw:text-[14px] tw:text-[var(--color-font-dark)]">
                  {t("need")}
                </h3>
                <a
                  href="mailto:info@workerhomes.pl"
                  className="tw:font-normal tw:text-[14px] tw:text-[var(--color-font-regular)]"
                >
                  info@workerhomes.pl
                </a>
              </div>
            </div>
          </div>

          <div className="tw:w-full tw:lg:w-[250px] tw:flex tw:gap-8">
            <div>
              <h3 className="tw:font-semibold tw:text-[14px] tw:text-[var(--color-font-dark)] tw:mb-4">
                {t("company.title")}
              </h3>
              <ul className="tw:space-y-4 font-normal tw:text-[14px] tw:text-[var(--color-font-regular)]">
                <li>
                  <Link href="#" className="tw:hover:underline">
                    {t("company.links.about")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="tw:hover:underline">
                    {t("company.links.contact")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="tw:hover:underline">
                    {t("company.links.faqs")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="tw:w-full tw:lg:w-[250px] tw:gap-8">
            <h3 className="tw:font-semibold tw:text-[14px] tw:text-[var(--color-font-dark)] tw:mb-4">
              {t("hosting.title")}
            </h3>
            <ul className="tw:space-y-4 font-normal tw:text-[14px] tw:text-[var(--color-font-regular)]">
              <li>
                <Link href="#" className="tw:hover:underline">
                  {t("hosting.host")}
                </Link>
              </li>
              <li>
                <Link href="#" className="tw:hover:underline">
                  {t("hosting.resource")}
                </Link>
              </li>
              <li>
                <Link href="#" className="tw:hover:underline">
                  {t("hosting.guide")}
                </Link>
              </li>
              <li>
                <Link href="#" className="tw:hover:underline">
                  {t("hosting.earn")}
                </Link>
              </li>
              <li>
                <Link href="#" className="tw:hover:underline">
                  {t("hosting.blog")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="tw:w-full tw:lg:w-[244px]">
            <h3 className="tw:font-semibold tw:text-[14px] tw:text-[var(--color-font-dark)] tw:mb-4">
              {t("follow.title")}
            </h3>
            <div className="tw:flex tw:gap-5 tw:text-2xl">
              <Link href="#" className="tw:hover:opacity-75">
                <img
                  src="/assets/facebook.png"
                  alt="Icon"
                  className="w-6 h-6"
                />
              </Link>
              <Link href="#" className="tw:hover:opacity-75">
                <img
                  src="/assets/linkedin.png"
                  alt="Icon"
                  className="w-6 h-6"
                />
              </Link>
              <Link href="#" className="tw:hover:opacity-75">
                <img src="/assets/twitter.png" alt="Icon" className="w-6 h-6" />
              </Link>
              <Link href="#" className="tw:hover:opacity-75">
                <img
                  src="/assets/instagram.png"
                  alt="Icon"
                  className="w-6 h-6"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="tw:border-t-2 tw:mt-8 tw:border-[var(--color-font-regular)] tw:pt-6">
          <div className="tw:flex tw:flex-col tw:md:flex-row tw:items-start tw:md:items-center tw:justify-between tw:gap-4">
            <div className="tw:text-[var(--color-font-regular)] tw:text-[14px]">
              {t("rights")}
            </div>
            <div className="tw:flex tw:gap-5 tw:flex-wrap tw:font-semibold tw:text-[16px] tw:text-[var(--color-font-dark)]">
              <Link href="#" className="tw:hover:underline">
                {t("copy.privacy")}
              </Link>
              <Link href="#" className="tw:hover:underline">
                {t("copy.terms")}
              </Link>
              <Link href="#" className="tw:hover:underline">
                {t("copy.sitemap")}
              </Link>
            </div>
            <div className="tw:mt-2 tw:md:mt-0 tw:text-[var(--color-font-regular)] tw:text-[16px]">
              <Link href="#" className="tw:hover:underline">
                {t("top")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
