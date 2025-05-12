import useFetch from "./useFetch";

export default function useFeatured(locale) {
  console.log("useFeatured", locale);
  const { data, error, isLoading } = useFetch({
    keys: ["dwellings"],
    url: "/api/dwellings",
    query: {
      locale: locale,
      populate: [
        "galleries.image",
        "category",
        "location.city",
        "prices",
        "features.icon",
      ],
      filters: {
        $and: [
          {
            isRecommended: {
              $eq: true,
            },
          },
          {
            isApproved: {
              $eq: true,
            },
          },
          {
            status: {
              $eq: "AVAILABLE",
            },
          },
        ],
      },
      pagination: {
        limit: 3,
      },
      locale: locale,
    },
  });

  const modifyFearturedData = (data) => {
    if (!data) return [];
    return data.map((item) => {
      const id = item.id;
      const title = item.title;
      const image = item?.galleries[0]?.image?.url || null;

      let features = item.features.map((feature) => {
        return {
          id: feature.id,
          title: feature.title,
          icon: feature.icon.url,
        };
      });

      let location = `${item.location[0].street_one}, ${item.location[0].city}, ${item.location[0].country}`;

      let price = item?.prices[0]?.amount || 0;

      return {
        id,
        title,
        image,
        features,
        location,
        price,
      };
    });
  };

  console.log("featuredListings", modifyFearturedData(data));

  return {
    featuredListingsLoading: isLoading,
    featuredListings: data ? modifyFearturedData(data) : [],
    featuredListingsError: error,
  };
}
