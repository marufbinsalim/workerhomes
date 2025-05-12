import Hero from "@/components/hero/main";
import Wrapper from "@/components/layout/Wrapper";
import MainPage from "@/components/pages/website/main";
import { exactPath } from "@/utils";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Loading from "./loading";
import Navbar from "@/components/common-v2/nav";
import { getCurrentUser } from "@/lib/session";
import Dashboard from "@/components/dashboard-v2/dashboard";
import Footer from "@/components/common-v2/footer";

export const metadata = {
  title: "Workerhomes | Home Rentals - Find Your Perfect Home for Rent",
  description:
    "Find your perfect home for rent with a variety of options to suit your needs.",
  keywords:
    "home rental, houses for rent, apartments for rent, rental properties",
  openGraph: {
    title: "Workerhomes",
    description:
      "Find your perfect home for rent with a variety of options to suit your needs.",
    url: "https://workerhomes.pl",
    type: "website",
    images: [
      {
        url: exactPath("/uploads/logo_dark_48857cce96.png"),
        width: 800,
        height: 600,
        alt: " Home Rentals - Find Your Perfect Home for Rent",
      },
    ],
  },
};

export default async function Main() {
  const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  await waitFor(1000);

  return (
    <Suspense fallback={<Loading />}>
      <div className="tw:flex tw:flex-col tw:min-h-screen">
        <Navbar session={null} />
        <main className="tw:flex-grow tw:pt-16">
          <Dashboard />
        </main>
        <Footer />
      </div>
    </Suspense>
  );
}

// export default dynamic(
//   () =>
//     Promise.resolve(({ params }) => (
//       <div className="tw:flex tw:flex-col tw:min-h-screen">
//         <Navbar session={getCurrentUser()} />
//         <main className="tw:flex-grow tw:pt-16">
//           <Dashboard />
//         </main>
//         <Footer />
//       </div>
//     )),
//   { ssr: false },
// );
