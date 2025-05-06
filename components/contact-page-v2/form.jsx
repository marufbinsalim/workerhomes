export default function ContactForm() {
  return (
    <div>
      <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:mb-4">
        <div>
          <label className="tw:block tw:text-gray-700 tw:mb-1">
            First name
          </label>
          <input
            type="text"
            className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
          />
        </div>
        <div>
          <label className="tw:block tw:text-gray-700 tw:mb-1">Last name</label>
          <input
            type="text"
            className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
          />
        </div>
      </div>

      <div className="tw:mb-4">
        <label className="tw:block tw:text-gray-700 tw:mb-1">Email</label>
        <input
          type="email"
          value="youmail@company.com"
          className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
        />
      </div>

      <div className="tw:mb-6">
        <label className="tw:block tw:text-gray-700 tw:mb-1">Message</label>
        <textarea
          className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 tw:h-32"
          placeholder="Leave a message for us..."
        ></textarea>
      </div>

      <button className="tw:w-full tw:bg-blue-600 tw:text-white tw:py-2 tw:px-4 tw:rounded-md hover:tw:bg-blue-700 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:ring-offset-2">
        Send to a message
      </button>
    </div>
  );
}
