import { update } from "@/lib/services/user";
import { Edit, Lock } from "lucide-react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

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
    <div className="tw:border tw:border-[#D8E0ED] tw:px-3 tw:md:px-5 tw:py-4 tw:md:py-7 tw:w-full">
      <h2 className="tw:text-lg tw:font-semibold tw:mb-4">
        Basic Information{isBusiness ? " (Business Account)" : ""}
      </h2>

      {/* Toggle Switch */}
      <div className="tw:flex tw:items-center tw:mb-6">
        {isBusiness ? (
          <FaToggleOn
            className="tw:text-gray-500 tw:w-6 tw:h-6"
            onClick={handleToggle}
          />
        ) : (
          <FaToggleOff
            className="tw:text-gray-500 tw:w-6 tw:h-6"
            onClick={handleToggle}
          />
        )}
        <label className="tw:ml-2 tw:text-sm">
          Turn {isBusiness ? "off" : "on"} business account
        </label>
      </div>

      {/* User Info Grid */}
      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-y-4 tw:gap-x-8 tw:mb-6">
        <div>
          <p className="tw:text-sm tw:text-gray-500">First Name</p>
          <p className="tw:text-base">{data?.first_name || ""}</p>
        </div>
        <div>
          <p className="tw:text-sm tw:text-gray-500">Last Name</p>
          <p className="tw:text-base">{data?.last_name || ""}</p>
        </div>

        {isBusiness && (
          <>
            <div>
              <p className="tw:text-sm tw:text-gray-500">Company Name</p>
              <p className="tw:text-base">{data?.company || ""}</p>
            </div>
            <div>
              <p className="tw:text-sm tw:text-gray-500">Vat No.</p>
              <p className="tw:text-base">{data?.vat_number || ""}</p>
            </div>
          </>
        )}

        <div>
          <p className="tw:text-sm tw:text-gray-500">Email</p>
          <p className="tw:text-base">{data?.email || ""}</p>
        </div>
        <div>
          <p className="tw:text-sm tw:text-gray-500">Phone No.</p>
          <p className="tw:text-base">{data?.phone || ""}</p>
        </div>
        <div>
          <p className="tw:text-sm tw:text-gray-500">Street & House No.</p>
          <p className="tw:text-base">{data?.address?.street_one || ""}</p>
        </div>
        <div>
          <p className="tw:text-sm tw:text-gray-500">City</p>
          <p className="tw:text-base">{data?.address?.city || ""}</p>
        </div>
        <div>
          <p className="tw:text-sm tw:text-gray-500">Country</p>
          <p className="tw:text-base">{data?.address?.country || ""}</p>
        </div>
        <div>
          <p className="tw:text-sm tw:text-gray-500">Postal Code</p>
          <p className="tw:text-base">{data?.address?.zip_code || ""}</p>
        </div>
        <div>
          <p className="tw:text-sm tw:text-gray-500">Languages</p>
          <p className="tw:text-base">{data?.locale?.toUpperCase() || ""}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="tw:flex tw:gap-3">
        <button
          className="tw:flex tw:items-center tw:bg-orange-500 tw:text-white tw:px-4 tw:py-2 tw:rounded tw:text-sm tw:hover:bg-orange-600 tw:transition"
          onClick={() => setEditing(true)}
        >
          <Edit className="tw:w-4 tw:h-4 tw:mr-2" />
          Edit
        </button>
        <button className="tw:flex tw:items-center tw:bg-white tw:text-gray-700 tw:border tw:border-gray-300 tw:px-4 tw:py-2 tw:rounded tw:text-sm tw:hover:bg-gray-100 tw:transition">
          <Lock className="tw:w-4 tw:h-4 tw:mr-2" />
          Change Password
        </button>
      </div>
    </div>
  );
}
