"use client";

import { Icon } from "@iconify/react";
import { useBookmarks } from "@/context/BookmarkProvider";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { HeartIcon } from "lucide-react";
import { showToast } from "@/components/toast/Toast";
import { useTranslations } from "next-intl";

const BookmarkButton = ({ item }) => {
  const router = useRouter();
  const { toggleBookmark, isBookmarked, totalBookmarks, isLoading } =
    useBookmarks();
  const locale = useParams().locale;
  const { data: session } = useSession();

  const t = useTranslations("heroSection");

  const handleBookmark = async (e) => {
    e.stopPropagation();

    if (!session) {
      router.push(`/${locale}/login`);
      return;
    } else {
      if (!item) return;

      try {
        const currentStatus = isBookmarked(item.id);
        await toggleBookmark(item.id, session?.id); // Use the new toggleBookmark function


        if (currentStatus) {
          showToast("success", t("toast.favoriteRemoved"));
        }
       
      }
      catch (error) {
        console.error("Error toggling bookmark:", error);
        showToast("error", "Failed to toggle bookmark");
      }
      
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleBookmark}
      className="tw:inline-flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-black/40 tw:rounded-full"
    >
      <HeartIcon
        className={`tw:w-6 tw:h-6 ${item && isBookmarked(item.id)
            ? "tw:fill-[var(--color-primary)]"
            : "tw:fill-none"
          } tw:stroke-white tw:stroke-2`}
      />
    </button>

  );
};

export default BookmarkButton;

// 'use client'

// import { Icon } from '@iconify/react'
// import { useBookmarks } from '@/context/BookmarkProvider'

// const BookmarkButton = ({ item }) => {
//   const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()

//   const handleBookmark = () => {
//     if (isBookmarked(item.id)) {
//       removeBookmark(item.id)
//     } else {
//       addBookmark(item)
//     }
//   }

//   return (
//     <button
//       onClick={handleBookmark}
//       className='button -blue-1 bg-white size-30 rounded-full shadow-2'
//     >
//       {isBookmarked(item.id) ? (
//         <Icon icon='fluent-emoji:red-heart' />
//       ) : (
//         <Icon icon='octicon:heart-24' />
//       )}
//     </button>
//   )
// }

// export default BookmarkButton
