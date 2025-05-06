export default function ContactInfo() {
  return (
    <div className="tw:flex-1 tw:h-full tw:flex tw:flex-col tw:gap-8 font-primary">
      <p className="tw:mb-2.5 tw:text-[var(--color-font-dark)] tw:text-[32px] tw:font-semibold">
        Contact Us
      </p>
      <div>
        <p className="tw:text-[var(--color-font-regular)]">Address</p>
        <p className="tw:text-[var(--color-font-dark)] tw:font-semibold tw:text-xl">
          328 Queensberry Street, North Melbourne VIC 3051, Australia.
        </p>
      </div>
      <div>
        <p className="tw:text-[var(--color-font-regular)]">
          Toll Free Customer Care
        </p>
        <p className="tw:text-[var(--color-font-dark)] tw:font-semibold tw:text-xl">
          +47 333 78 901
        </p>
      </div>
      <div>
        <p className="tw:text-[var(--color-font-regular)]">
          Need live support?
        </p>
        <p className="tw:text-[var(--color-font-dark)] tw:font-semibold tw:text-xl">
          info@workerhomes.pl
        </p>
      </div>

      <div className="tw:flex tw:gap-2 tw:flex-col">
        <p className="tw:text-[var(--color-font-dark)] tw:font-semibold tw:text-[14px]">
          Follow us on social media
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
