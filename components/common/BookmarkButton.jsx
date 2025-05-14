"use client";

import { Icon } from "@iconify/react";
import { useBookmarks } from "@/context/BookmarkProvider";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const BookmarkButton = ({ item }) => {
  const router = useRouter();
  const { toggleBookmark, isBookmarked, totalBookmarks, isLoading } =
    useBookmarks();
  const locale = useParams().locale;
  const { data: session } = useSession();

  const handleBookmark = async (e) => {
    e.stopPropagation();

    if (!session) {
      router.push(`/${locale}/login`);
      return;
    } else {
      if (!item) return;
      await toggleBookmark(item.id, session?.id); // Use the new toggleBookmark function
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleBookmark}
      className="button -blue-1 bg-white size-30 rounded-full shadow-2"
      style={{}}
    >
      {item && isBookmarked(item.id) ? (
        <Icon icon="fluent-emoji:red-heart" />
      ) : (
        <Icon icon="octicon:heart-24" />
      )}
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
