import Navbar from "@/components/common-v2/nav";
import Content from "@/components/dashboard/dashboard/common/Content";
import Sidebar from "@/components/dashboard/dashboard/common/Sidebar";
import Header from "@/components/header/dashboard-header";
import { BreadcrumbProvider } from "@/context/Breadcrumb";
import { PermissionsProvider } from "@/context/PermissionProvider";

import { getCurrentUser } from "@/lib/session";

const DashboardLayout = async ({ params, children }) => {
 const session = await getCurrentUser();
 

  return (
    <BreadcrumbProvider>
      <PermissionsProvider locale={params?.locale}>
        <div className=""></div>

        <Header session={session} />
        {/* <Navbar session={session} /> */}

        <div className="dashboard ">
          <div className="dashboard__sidebar tw:bg-white tw:flex tw:justify-center tw:overflow-auto scroll-bar-1 ">
            <Sidebar />
          </div>

          <div className="dashboard__main">
            <Content>{children}</Content>
          </div>
        </div>
      </PermissionsProvider>
    </BreadcrumbProvider>
  );
};
export default DashboardLayout;
