"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const MessengerPage = ({ locale }) => {
  const t = useTranslations("messenger");
  const { data: session } = useSession();

  return (
    <>
      <p> {JSON.stringify(session)} </p>
    </>
  );
};

export default MessengerPage;
