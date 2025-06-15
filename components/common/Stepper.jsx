"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const Stepper = ({ children, onStepChange, error }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeStep = parseInt(searchParams.get("step")) || 0;
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === children.length - 1;
  const t = useTranslations("dwellings");

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handlePrevStep = () => {
    if (activeStep === 0 || isFirstStep) return;
    onStepChange(activeStep - 1);
    router.push(pathname + "?" + createQueryString("step", activeStep - 1));
  };

  const handleNextStep = () => {
    if (activeStep === children.length - 1 || isLastStep || error) return;
    onStepChange(activeStep + 1);
    router.push(pathname + "?" + createQueryString("step", activeStep + 1));
  };

  const currentStep = children[activeStep];

  useEffect(() => {
    if (error) {
      onStepChange(1);
      router.push(pathname + "?" + createQueryString("step", 0));
    }
  }, [error]);

  return (
    <div className="tw:left-[var(--dashboard-width)] tw:overflow-auto tw:transition-all tw:duration-500 tw:ease-out-cubic">
      <div className="tw:md:px-4 tw:py-4">
        {/* Stepper header */}
        <div
          className={`tw:bg-white tw:flex tw:flex-col tw:items-center tw:my-15 tw:rounded-lg tw:px-6 tw:py-4  tw:md:px-10 tw:md:py-1 tw:max-h-[calc(100dvh-100px)]
            tw:overflow-auto
            ${activeStep === 0 ? "hide-scrollbar" : ""}
            `}
        >
          <div className="tw:w-full tw:flex tw:gap-1 tw:pb-4 tw:overflow-x-auto tw:min-h-[100px]">
            {children.map((child, index) => {
              if (!child) return null;
              return (
                <div
                  key={index}
                  className={`tw:flex tw:items-center tw:flex-shrink-0 ${
                    activeStep === index
                      ? "tw:font-medium "
                      : "tw:text-[#B7B7B7] tw:text-[16px] tw:font-medium "
                  }`}
                >
                  <div
                    className={`tw:flex tw:items-center tw:justify-center tw:mr-2 ${
                      activeStep === index
                        ? "tw:w-10 tw:h-10 tw:gap-[10px] tw:p-[10px] tw:border tw:border-solid tw:border-[var(--color-primary)]  tw:rounded-[20px] tw:bg-white tw:text-[var(--color-primary)]"
                        : "tw:w-10 tw:h-10 tw:border tw:border-[#D8E0ED] tw:rounded-full tw:bg-white"
                    }`}
                  >
                    {index}
                  </div>
                  <span
                    className={`tw:text-lg ${
                      activeStep === index
                        ? "tw:text-[var(--color-primary)] tw:font-medium tw:text-[15px]"
                        : "tw:text-[#B7B7B7] tw:font-medium tw:text-[15px]"
                    }`}
                  >
                    {child?.props?.title || ""}
                  </span>
                  {index < children.length - 1 && (
                    <div className="tw:mx-2">
                      <div className="tw:w-[50px] tw:h-[2px] tw:bg-[#D8E0ED]"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Prev button */}
          {!isFirstStep && (
            <div className="tw:w-full">
              <button
                className="tw:flex tw:items-center tw:text-[var(--color-primary)] tw:font-medium tw:text-lg"
                onClick={handlePrevStep}
              >
                <Icon
                  icon="akar-icons:arrow-left"
                  className="tw:mr-2"
                  width={24}
                />
              </button>
            </div>
          )}
          {currentStep}
        </div>
      </div>
    </div>
  );
};

export default Stepper;

export const Step = ({ children, title, actions = false }) => {
  return (
    <div
      className="tw:rounded-lg tw:w-full tw:flex tw:justify-start tw:py-[10px]"
      data-title={title}
      data-actions={actions}
    >
      {children}
    </div>
  );
};
