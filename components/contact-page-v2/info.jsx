import { useTranslations } from "next-intl";

export default function ContactInfo() {
  const t = useTranslations('contactUs');
  return (
    <div className="tw:flex-1 tw:h-full tw:flex tw:flex-col tw:gap-8 font-primary">
      <p className="tw:mb-2.5 tw:text-[var(--color-font-dark)] tw:text-[32px] tw:font-semibold">
        {t('info.title')}
      </p>
      <div>
        <p className="tw:text-[var(--color-font-regular)]"> {t('info.addressLabel')} </p>
        <p className="tw:text-[var(--color-font-dark)] tw:font-semibold tw:text-xl">
          {t('info.address')}
        </p>
      </div>
      <div>
        <p className="tw:text-[var(--color-font-regular)]">
          {t('info.customerCareLabel')}
        </p>
        <p className="tw:text-[var(--color-font-dark)] tw:font-semibold tw:text-xl">
          {t('info.customerCare')}
        </p>
      </div>
      <div>
        <p className="tw:text-[var(--color-font-regular)]">
          {t('info.liveSupportLabel')}
        </p>
        <p className="tw:text-[var(--color-font-dark)] tw:font-semibold tw:text-xl">
          {t('info.liveSupport')}
        </p>
      </div>

      <div className="tw:flex tw:gap-2 tw:flex-col">
        <p className="tw:text-[var(--color-font-dark)] tw:font-semibold tw:text-[14px]">
          {t('info.followUsLabel')}
        </p>
        <div className="tw:flex tw:gap-5">
          <img
            src={"/assets/facebook.png"}
            alt="facebook"
            className="h-[46px]"
          />
          <img
            src={"/assets/linkedin.png"}
            alt="linkedin"
            className="h-[46px]"
          />
          <img src={"/assets/twitter.png"} alt="twitter" className="h-[46px]" />
          <img
            src={"/assets/instagram.png"}
            alt="instagram"
            className="h-[46px]"
          />
        </div>
      </div>
    </div>
  );
}
