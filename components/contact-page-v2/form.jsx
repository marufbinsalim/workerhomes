export default function ContactForm() {
  return (
    <div className="tw:flex-1 font-primary tw:flex tw:flex-col tw:gap-5">
      <div className="tw:grid tw:grid-cols-2 tw:gap-5">
        <div>
          <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
            First name
          </label>
          <input
            type="text"
            className="tw:w-full tw:bg-[var(--color-white-grey)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
          />
        </div>
        <div>
          <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
            Last name
          </label>
          <input
            type="text"
            className="tw:w-full tw:bg-[var(--color-white-grey)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
          />
        </div>
      </div>

      <div className="">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          Email
        </label>
        <input
          type="email"
          className="tw:w-full tw:bg-[var(--color-white-grey)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
        />
      </div>

      <div className="">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          Message
        </label>
        <textarea
          className="tw:w-full tw:bg-[var(--color-white-grey)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 tw:h-32"
          placeholder="Leave a message for us..."
        ></textarea>
      </div>

      <button className="tw:w-max tw:bg-[var(--color-primary)] tw:text-white tw:py-[10px] tw:px-5  hover:tw:bg-blue-700 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:ring-offset-2">
        Send to a message
      </button>
    </div>
  );
}
