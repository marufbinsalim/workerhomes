import { update } from "@/lib/services/user";
import { Edit, Lock } from "lucide-react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";


export default function profileInfo({
  data,
  setIsBusiness,
  isBusiness,
  reFetch,
  setEditing,
  t,
}) {
  const handleToggle = async () => {
    const res = await update(
      {
        ...data,
        businessAccount: !isBusiness,
      },
      t("messages.update"),
    );
    setIsBusiness(!isBusiness);
    reFetch();
  };

  return (
    <div className="tw:border font-secondary tw:border-[#D8E0ED] tw:px-3 tw:md:px-5 tw:py-4 tw:md:py-7  tw:w-full">
      <h2 className="tw:text-[18px] tw:font-semibold tw:mb-4 tw:pb-4 tw:border-b tw:border-b-gray-200 tw:text-[var(--color-font-regular)]">
        Basic Information{isBusiness ? " (Business Account)" : ""}
      </h2>

      {/* Toggle Switch */}
      <div>
        <div className="tw:flex tw:items-center tw:mb-6">
          <label className="tw:flex tw:items-center tw:cursor-pointer">
            <div className="tw:relative">
              <input
                type="checkbox"
                className="tw:sr-only"
                checked={isBusiness}
                onChange={handleToggle}
              />
              <div
                className={`tw:w-[30px] tw:h-[18px] tw:rounded-full tw:shadow-inner tw:transition-colors ${isBusiness ? "tw:bg-[#FF780B]" : "tw:bg-[#C0C0C0]"
                  }`}
              ></div>
              <div
                className={`tw:absolute tw:top-[1px] tw:left-[1px] tw:w-[16px] tw:h-[16px] tw:bg-white tw:rounded-full tw:shadow-md tw:transform tw:transition-transform ${isBusiness ? "tw:translate-x-[12px]" : "tw:translate-x-0"
                  }`}
              ></div>
            </div>
            <span className="tw:ml-2 tw:text-[14px] tw:font-medium tw:text-[var(--color-font-dark)]">
              Turn {isBusiness ? "off" : "on"} business account
            </span>
          </label>
        </div>

        {/* User Info Grid */}
        <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-y-4 tw:gap-x-10 tw:mb-6">
          {/* First Name */}
          <div className="tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2">
            <p className="tw:text-[16px] tw:text-[var(--color-font-regular)] tw:m-0">First Name</p>
            <p className="tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:m-0 tw:font-medium">
              {data?.first_name || "-"}
            </p>
          </div>

          {/* Last Name */}
          <div className="tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2">
            <p className="tw:text-[16px] tw:text-[var(--color-font-regular)] tw:m-0">Last Name</p>
            <p className="tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:m-0 tw:font-medium">
              {data?.last_name || "-"}
            </p>
          </div>

          {isBusiness && (
            <>
              {/* Company Name */}
              <div className="tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2">
                <p className="tw:text-[16px] tw:text-[var(--color-font-regular)] tw:m-0">Company Name</p>
                <p className="tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:m-0 tw:font-medium">
                  {data?.company || "-"}
                </p>
              </div>

              {/* VAT Number */}
              <div className="tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2">
                <p className="tw:text-[16px] tw:text-[var(--color-font-regular)] tw:m-0">VAT No.</p>
                <p className="tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:m-0 tw:font-medium">
                  {data?.vat_number || "-"}
                </p>
              </div>
            </>
          )}

          {/* Email */}
          <div className="tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2">
            <p className="tw:text-[16px] tw:text-[var(--color-font-regular)] tw:m-0">Email</p>
            <p className="tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:m-0 tw:font-medium">
              {data?.email || "-"}
            </p>
          </div>

          {/* Phone */}
          <div className="tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2">
            <p className="tw:text-[16px] tw:text-[var(--color-font-regular)] tw:m-0">Phone No.</p>
            <p className="tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:m-0 tw:font-medium">
              {data?.phone || "-"}
            </p>
          </div>

          {/* Street & House No. - Full width */}
          <div className="tw:col-span-1 tw:md:col-span-2 tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2 tw:min-h-[90px]">
            <p className="tw:text-[16px] tw:text-[var(--color-font-regular)] tw:m-0">Street & House No.</p>
            <p className="tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:m-0 tw:font-medium">
              {data?.address?.street_one || "-"}
            </p>
          </div>

          {/* City */}
          <div className="tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2">
            <p className="tw:text-[16px] tw:text-[var(--color-font-regular)] tw:m-0">City</p>
            <p className="tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:m-0 tw:font-medium">
              {data?.address?.city || "-"}
            </p>
          </div>

          {/* Country */}
          <div className="tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2">
            <p className="tw:text-[16px] tw:text-[var(--color-font-regular)] tw:m-0">Country</p>
            <p className="tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:m-0 tw:font-medium">
              {data?.address?.country || "-"}
            </p>
          </div>

          {/* Postal Code */}
          <div className="tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2">
            <p className="tw:text-[16px] tw:text-[var(--color-font-regular)] tw:m-0">Postal Code</p>
            <p className="tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:m-0 tw:font-medium">
              {data?.address?.zip_code || "-"}
            </p>
          </div>

          {/* Languages */}
          <div className="tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2">
            <p className="tw:text-[16px] tw:text-[var(--color-font-regular)] tw:m-0">Languages</p>
            <p className="tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:m-0 tw:font-medium">
              {data?.locale?.toUpperCase() || "-"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="tw:flex tw:gap-3">
          <button
            className="tw:flex tw:items-center tw:bg-[#FF780B] tw:text-white tw:font-semibold tw:text-[14px] tw:px-4 tw:py-2 tw:rounded tw:text-sm  tw:transition"
            onClick={() => setEditing(true)}
          >
            <Edit className="tw:w-6 tw:h-6 tw:mr-2" />
            Edit
          </button>
          <button className="tw:flex tw:items-center tw:bg-white tw:text-[#FF780B] tw:font-semibold tw:text-[14px] tw:border tw:border-[#FF780B] tw:px-4 tw:py-2 tw:rounded tw:text-sm  tw:transition">
            <FiRefreshCcw className="tw:w-6 tw:h-6 tw:mr-2" />
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
