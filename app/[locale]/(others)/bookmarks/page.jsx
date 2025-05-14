import Wrapper from "@/components/layout/Wrapper";
import BookmarkPage from "@/components/pages/website/bookmarks";
import { getCurrentUser } from "@/lib/session";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: "bookmark" });

  return {
    title: t("title"),
  };
}

export default async function BookMark({ params: { locale } }) {
  const session = await getCurrentUser();
  return (
    <Wrapper>
      <BookmarkPage session={session} />
    </Wrapper>
  );
}

// export default dynamic(
//   () =>
//     Promise.resolve(() => (
//       <Wrapper>
//         <BookmarkPage />
//       </Wrapper>
//     )),
//   {
//     ssr: false,
//   },
// );
