import Sidebar from "@/components/dashboard/dashboard/common/Sidebar";
import Header from "@/components/header/dashboard-header";
import { BreadcrumbProvider } from "@/context/Breadcrumb";
import { PermissionsProvider } from "@/context/PermissionProvider";

import { getCurrentUser } from "@/lib/session";
import Link from "next/link";

const DashboardLayout = async ({ params, children }) => {
  const user = await getCurrentUser();

  return (
    <BreadcrumbProvider>
      <PermissionsProvider locale={params?.locale}>
        <div className="header-margin"></div>

        <Header user={user} />

        <Link href={`/${params?.locale}/dashboard/dwellings`}>
          <p>Dashboard</p>
        </Link>

        <div className="messenger">
          <div className="messenger__main">{children}</div>
        </div>
      </PermissionsProvider>
    </BreadcrumbProvider>
  );
};
export default DashboardLayout;
