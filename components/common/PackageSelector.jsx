import useFetch from "@/hooks/useFetch";
import { Icon } from "@iconify/react";
import PackageSelectCard from "./card/PackageSelectCard";

const PackageSelector = ({ value, onChange }) => {
  const { data, error, isLoading } = useFetch({
    url: "/api/packages",
    keys: ["plans", open],
    query: {
      sort: ["order:asc"],
    },
  });

  return (
    <div className="tw:w-full tw:min-h-[591px] tw:px-4 tw:md:px-0">
      <div className="tw:flex tw:flex-col tw:items-center tw:md:flex-row tw:gap-6 tw:md:gap-[30px]">
        {isLoading ? (
          <div className="tw:w-full tw:text-center">
            {/* Loading spinner can be added here */}
          </div>
        ) : data?.length > 0 && !isLoading ? (
          data.map((plan) => (
            <div
              key={plan.id}
              className="tw:md:w-[288px] tw:w-full tw:max-w-full"
            >
              <PackageSelectCard
                item={plan}
                value={value}
                onChange={onChange}
              />
            </div>
          ))
        ) : (
          <div className="tw:w-full tw:text-center">No plans available</div>
        )}
      </div>
    </div>
  );
};

export default PackageSelector;
