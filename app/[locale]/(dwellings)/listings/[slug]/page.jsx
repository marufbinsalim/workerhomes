import Wrapper from "@/components/layout/Wrapper";
import ListingDetail from "@/components/listing-details-v2/ListingDetail";
import SingleListing from "@/components/pages/website/single-listing/page";
import { api } from "@/config";
import { getCurrentUser } from "@/lib/session";
import { exactPath } from "@/utils";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

const fetchListingBySlug = async (slug, locale) => {
  // Fetch listing by slug
  const res = await fetch(
    api +
      `/api/dwellings?filters[slug][$eq]=${slug}&populate=galleries.image,features.icon,seo,location,contact,amenities,category,prices,subscription.package,owner,subscription.package.icon,localizations&locale=${locale}`,
    {
      next: {
        revalidate: 0,
      },
    }
  );
  const data = await res.json();
  return data?.data?.[0] || [];
};

export async function generateMetadata({ params: { locale, slug } }) {
  const t = await getTranslations({ locale, namespace: "listings" });
  const data = await fetchListingBySlug(slug, locale);
  const session = await getCurrentUser();

  const seo = data?.seo?.[0];

  return {
    title: seo?.metaTitle || "Worker homes",
    description: seo?.metaDescription || "Worker homes",
    keywords: seo?.keywords || "home, apartment, rent",
    openGraph: {
      title: seo?.metaTitle || "Worker homes",
      description: seo?.metaDescription || "Worker homes",
      url: seo?.canonicalUrl || "https://workerhomes.pl/listings",
      type: "website",
      images: [
        {
          url: exactPath("/uploads/logo_dark_48857cce96.png"),
          width: 800,
          height: 600,
          alt: seo?.metaTitle || "Default Title",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@workerhomes",
      title: seo?.metaTitle || "Default Title",
      description: seo?.metaDescription || "Default Description",
      image: exactPath("/uploads/logo_dark_48857cce96.png"),
    },
  };
}

export default async function Main({ params }) {
  const session = await getCurrentUser();
  const data = await fetchListingBySlug(params.slug, params.locale);

  let slugMap = [
    {
      locale: data.locale,
      slug: data.slug,
    },
  ];

  if (data.localizations) {
    let localizationsSlugs = data.localizations.map((item) => ({
      locale: item.locale,
      slug: item.slug,
    }));
    slugMap = [...slugMap, ...localizationsSlugs];
  }

  console.log(slugMap);

  return (
    <Wrapper slugMap={slugMap}>
      <ListingDetail data={data} locale={params.locale} session={session} />
    </Wrapper>
  );
}
