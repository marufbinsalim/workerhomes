"use client";

import Footer from "@/components/common-v2/footer";
import Navbar from "@/components/common-v2/nav";
import Dashboard from "@/components/dashboard-v2/dashboard";
import { Icon } from "@iconify/react";
import { CircleDashed, CircleDotDashed } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        width: "100dvw",
        height: "100dvh",
      }}
      className="tw:flex tw:items-center tw:justify-center"
    >
      <div className="tw:flex tw:flex-col tw:items-center">
        <CircleDashed
          size={40}
          className="tw:animate-spin tw:duration-500  tw:text-[var(--color-primary)]"
        />
      </div>
    </div>
  );
};

export default Loading;
