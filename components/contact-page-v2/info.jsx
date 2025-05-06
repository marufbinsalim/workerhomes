export default function ContactInfo() {
  return (
    <div className="tw:flex-1 tw:h-full tw:flex tw:flex-col tw:gap-8">
      <p className="tw:mb-2.5 tw:text-[var(--color-font-dark)] tw:text-[32px] tw:font-semibold">
        Contact Us
      </p>
      <div>
        <p className="tw:text-[var(--color-font-regular)]">Address</p>
        <p className="tw:text-[var(--color-font-dark)] tw:font-semibold">
          328 Queensberry Street, North Melbourne VIC 3051, Australia.
        </p>
      </div>
      <div>
        <p className="tw:text-[var(--color-font-regular)]">
          Toll Free Customer Care
        </p>
        <p className="tw:text-[var(--color-font-dark)] tw:font-semibold">
          +47 333 78 901
        </p>
      </div>
      <div>
        <p className="tw:text-[var(--color-font-regular)]">
          Need live support?
        </p>
        <p className="tw:text-[var(--color-font-dark)] tw:font-semibold">
          hi@gotrip.com
        </p>
      </div>

      <div>Social</div>
    </div>
  );
}
