"use client";
import { update } from "@/lib/services/user";
import { useFormik } from "formik";
import { Check, XIcon } from "lucide-react";
import { useState } from "react";

export default function ProfileEdit({
  data,
  onSubmit,
  onCancel,
  t,
  reFetch,
  isBusiness, // Add isBusiness prop
  setEditing, // Add setEditing prop
}) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      street_one: data?.address?.street_one || "",
      city: data?.address?.city || "",
      country: data?.address?.country || "",
      zip_code: data?.address?.zip_code || "",
      locale: data?.locale || "",
      newsletter: false,
      company: data?.company || "", // Add company field
      vat_number: data?.vat_number || "", // Add VAT number field
    },
    onSubmit: async (values, { setErrors }) => {
      const errors = {};

      // Manual validation
      if (!values.first_name) {
        errors.first_name = t("validation.firstNameRequired");
      }
      if (!values.last_name) {
        errors.last_name = t("validation.lastNameRequired");
      }
      if (!values.email) {
        errors.email = t("validation.emailRequired");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = t("validation.invalidEmail");
      }
      if (!values.phone) {
        errors.phone = t("validation.phoneRequired");
      }
      // Optional: Add validation for business fields
      if (isBusiness && !values.company) {
        errors.company = t("validation.companyRequired");
      }
      if (isBusiness && !values.vat_number) {
        errors.vat_number = t("validation.vatNumberRequired");
      }

      if (Object.keys(errors).length > 0) {
        setErrors(errors);
      } else {
        console.log("Form submitted with values:", values);

        let formattedValues = {
          ...data,
          first_name: values.first_name,
          last_name: values.last_name,
          name: `${values.first_name} ${values.last_name}`,
          email: values.email,
          phone: values.phone,
          address: {
            street_one: values.street_one,
            city: values.city,
            country: values.country,
            zip_code: values.zip_code,
          },
          locale: values.locale,
          businessAccount: isBusiness, // Include business account status
          ...(isBusiness && {
            company: values.company,
            vat_number: values.vat_number,
          }), // Conditionally include business fields
        };

        const res = await update(formattedValues, t("messages.update"));
        reFetch();
        onSubmit(values);
        setEditing(false); // Close the edit form after submission
      }
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { value: "en", label: "English" },
    { value: "pl", label: "Polish" },
    { value: "de", label: "German" },
    // Add more languages as needed
  ];

  const handleOptionClick = (value) => {
    formik.setFieldValue("locale", value);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="tw:border font-secondary tw:border-[#D8E0ED] tw:px-3 tw:md:px-5 tw:py-4 tw:md:py-7 tw:w-full">
      <h2 className="tw:text-[18px] tw:font-medium tw:text-[var(--color-font-regular)] tw:mb-4">
        {t("form.field.basicInformation")}
        {isBusiness ? t("form.field.businessAccount") : ""}
      </h2>

      <form onSubmit={formik.handleSubmit}>
        <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-y-4 tw:gap-x-8 tw:mb-6">
          {/* First Name */}
          <div>
            <label className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
              {t("form.field.first_name")}
            </label>
            <input
              type="text"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`tw:w-full tw:p-2 tw:border tw:border-[#D8E0ED] tw:text-[14px] tw:font-normal tw:text-[var(--color-font-regular)]  tw:mt-1 tw:bg-[#F8F9FB] ${
                formik.touched.first_name && formik.errors.first_name
                  ? "tw:border-red-500"
                  : ""
              }`}
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <p className="tw:text-red-500 tw:text-xs tw:mt-1">
                {formik.errors.first_name}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
              {t("form.field.last_name")}
            </label>
            <input
              type="text"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`tw:w-full tw:p-2 tw:border tw:border-[#D8E0ED] tw:text-[14px] tw:font-normal tw:text-[var(--color-font-regular)]  tw:mt-1 tw:bg-[#F8F9FB] ${
                formik.touched.last_name && formik.errors.last_name
                  ? "tw:border-red-500"
                  : ""
              }`}
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <p className="tw:text-red-500 tw:text-xs tw:mt-1">
                {formik.errors.last_name}
              </p>
            )}
          </div>

          {/* Business Fields */}
          {isBusiness && (
            <>
              {/* Company Name */}
              <div>
                <label className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
                  {t("form.field.company")}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formik.values.company}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`tw:w-full tw:p-2 tw:border tw:border-[#D8E0ED] tw:text-[14px] tw:font-normal tw:text-[var(--color-font-regular)]  tw:mt-1 tw:bg-[#F8F9FB] ${
                    formik.touched.company && formik.errors.company
                      ? "tw:border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.company && formik.errors.company && (
                  <p className="tw:text-red-500 tw:text-xs tw:mt-1">
                    {formik.errors.company}
                  </p>
                )}
              </div>

              {/* VAT Number */}
              <div>
                <label className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
                  {t("form.field.vat")}
                </label>
                <input
                  type="text"
                  name="vat_number"
                  value={formik.values.vat_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`tw:w-full tw:p-2 tw:border tw:border-[#D8E0ED] tw:text-[14px] tw:font-normal tw:text-[var(--color-font-regular)]  tw:mt-1 tw:bg-[#F8F9FB] ${
                    formik.touched.vat_number && formik.errors.vat_number
                      ? "tw:border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.vat_number && formik.errors.vat_number && (
                  <p className="tw:text-red-500 tw:text-xs tw:mt-1">
                    {formik.errors.vat_number}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
              {t("form.field.email")}
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`tw:w-full tw:p-2 tw:border tw:border-[#D8E0ED] tw:text-[14px] tw:font-normal tw:text-[var(--color-font-regular)]  tw:mt-1 tw:bg-[#F8F9FB] ${
                formik.touched.email && formik.errors.email
                  ? "tw:border-red-500"
                  : ""
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="tw:text-red-500 tw:text-xs tw:mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Phone No. */}
          <div>
            <label className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
              {t("form.field.phone")}
            </label>
            <input
              type="text"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`tw:w-full tw:p-2 tw:border tw:border-[#D8E0ED] tw:text-[14px] tw:font-normal tw:text-[var(--color-font-regular)]  tw:mt-1 tw:bg-[#F8F9FB] ${
                formik.touched.phone && formik.errors.phone
                  ? "tw:border-red-500"
                  : ""
              }`}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="tw:text-red-500 tw:text-xs tw:mt-1">
                {formik.errors.phone}
              </p>
            )}
          </div>

          {/* Street & House No. */}
          <div className="tw:col-span-1 tw:md:col-span-2 tw:flex tw:flex-col tw:gap-1 tw:justify-center tw:py-2">
            <label className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
              {t("form.field.streetAndHouseNo")}
            </label>
            <textarea
              name="street_one"
              value={formik.values.street_one}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="tw:w-full tw:p-2 tw:border tw:border-[#D8E0ED] tw:text-[14px] tw:min-h-[90px] tw:font-normal tw:text-[var(--color-font-regular)] tw:mt-1 tw:bg-[#F8F9FB] tw:resize-none"
            />
          </div>

          {/* City */}
          <div>
            <label className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
              {t("form.field.city")}
            </label>
            <input
              type="text"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="tw:w-full tw:p-2 tw:border tw:border-[#D8E0ED] tw:text-[14px] tw:font-normal tw:text-[var(--color-font-regular)]  tw:mt-1 tw:bg-[#F8F9FB]"
            />
          </div>

          {/* Country */}
          <div>
            <label className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
              {t("form.field.country")}
            </label>
            <input
              type="text"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="tw:w-full tw:p-2 tw:border tw:border-[#D8E0ED] tw:text-[14px] tw:font-normal tw:text-[var(--color-font-regular)]  tw:mt-1 tw:bg-[#F8F9FB]"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
              {t("form.field.postalCode")}
            </label>
            <input
              type="text"
              name="zip_code"
              value={formik.values.zip_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="tw:w-full tw:p-2 tw:border tw:border-[#D8E0ED] tw:text-[14px] tw:font-normal tw:text-[var(--color-font-regular)]  tw:mt-1 tw:bg-[#F8F9FB]"
            />
          </div>

          {/* Language */}
          <div className="tw:relative">
            <label className="tw:text-[16px] tw:font-semibold tw:text-[var(--color-font-dark)]">
              {t("form.field.language")}
            </label>
            <div
              className="tw:w-full tw:p-2 tw:border tw:border-[#D8E0ED] tw:text-[14px] tw:font-normal tw:text-[var(--color-font-regular)] tw:mt-1 tw:bg-[#F8F9FB] tw:cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {formik.values.locale
                ? languages.find((lang) => lang.value === formik.values.locale)
                    ?.label
                : t("profile.selectOne")}
            </div>
            {isOpen && (
              <div className="tw:absolute tw:w-[280px] tw:h-[202px] tw:right-0 tw:bg-[#F8F9FB] tw:border tw:border-[#D8E0ED] tw:shadow-lg tw:z-10">
                <div className="tw:flex tw:flex-col tw:gap-2 tw:p-2 tw:h-full tw:overflow-y-auto">
                  {languages.map((lang) => (
                    <div
                      key={lang.value}
                      className="tw:flex tw:items-center tw:cursor-pointer hover:tw:bg-gray-100 tw:p-2"
                      onClick={() => handleOptionClick(lang.value)}
                    >
                      <div className="tw:relative tw:mr-2 tw:flex-shrink-0 tw:flex tw:items-center">
                        <input
                          type="checkbox"
                          name={`locale-${lang.value}`}
                          checked={formik.values.locale === lang.value}
                          onChange={() => handleOptionClick(lang.value)}
                          className="tw:appearance-none tw:w-[18px] tw:h-[18px] tw:rounded-[4px] tw:bg-white tw:border tw:border-gray-300 tw:checked:bg-[#FF780B]"
                        />
                        <svg
                          className={`tw:absolute tw:top-0 tw:left-0 tw:w-[18px] tw:h-[18px] tw:pointer-events-none ${formik.values.locale === lang.value ? "tw:visible" : "tw:invisible"}`}
                          viewBox="0 0 16 16"
                          fill="white"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6.75 11.25L3.5 8l1.414-1.414L6.75 8.586l4.586-4.586L12.75 5.414z" />
                        </svg>
                      </div>
                      <span className="tw:text-[14px] tw:font-normal tw:text-[var(--color-font-dark)] tw:leading-[18px]">
                        {lang.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Newsletter Checkbox */}
        <div className="tw:mb-6">
          <label className="tw:flex tw:items-center tw:text-[var(--color-font-dark)] tw:font-normal tw:text-[14px]">
            <div className="tw:relative tw:mr-2 tw:w-[18px] tw:h-[18px]">
              <input
                type="checkbox"
                name="newsletter"
                checked={formik.values.newsletter}
                onChange={formik.handleChange}
                className="tw:appearance-none tw:w-[18px] tw:h-[18px] tw:rounded-[4px] tw:bg-white tw:border tw:border-gray-300 tw:checked:bg-[#FF780B]"
              />
              <svg
                className={`tw:absolute tw:top-0 tw:left-0 tw:w-[18px] tw:h-[18px] tw:pointer-events-none ${formik.values.newsletter ? "tw:visible" : "tw:invisible"}`}
                viewBox="0 0 16 16"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.75 11.25L3.5 8l1.414-1.414L6.75 8.586l4.586-4.586L12.75 5.414z" />
              </svg>
            </div>
            {t("form.field.subscribeNewsletter")}
          </label>
        </div>

        {/* Action Buttons */}
        <div className="tw:flex tw:gap-3">
          <button
            type="button"
            onClick={() => {
              setEditing(false);
            }}
            className="tw:bg-white tw:text-[var(--color-primary)] tw:font-semibold tw:border tw:border-[var(--color-primary)] tw:px-4 tw:py-2 tw:text-[14px] "
          >
            <XIcon size={24} className="tw:inline tw:mr-1" />
            {t("button.cancel")}{" "}
          </button>
          <button
            type="submit"
            className="tw:bg-[var(--color-primary)] tw:text-white tw:font-semibold tw:px-4 tw:py-2 tw:rounded tw:text-[14px] "
          >
            <Check size={24} className="tw:inline tw:mr-1" />
            {t("button.confirm")}
          </button>
        </div>
      </form>
    </div>
  );
}
