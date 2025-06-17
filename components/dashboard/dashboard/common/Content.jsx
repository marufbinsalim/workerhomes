"use client";

import { usePathname } from "next/navigation";

export default function Content({ children }) {
    const pathName = usePathname();
    const isMessengerPage = pathName.includes("/messenger");
    return (
        <>
            {
                isMessengerPage ? (
                    <div className = "dashboard__content bg-light-2 tw:bg-green-500 ">{children}</div>
                ) : (
                    <div className="dashboard__content bg-light-2 ">{children}</div>
                )
            }
        </>

  );
}
