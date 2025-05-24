import Navbar from "@/components/common-v2/nav";
import Content from "@/components/dashboard/dashboard/common/Content";
import Sidebar from "@/components/dashboard/dashboard/common/Sidebar";
import Header from "@/components/header/dashboard-header";
import { BreadcrumbProvider } from "@/context/Breadcrumb";
import { PermissionsProvider } from "@/context/PermissionProvider";

import { getCurrentUser } from "@/lib/session";

const DashboardLayout = async ({ params, children }) => {
//  const session = await getCurrentUser();
 const user = await getCurrentUser();

  return (
    <BreadcrumbProvider>
      <PermissionsProvider locale={params?.locale}>
        <div className=""></div>

        {/* <Header user={user} /> */}
        {/* <Navbar session={session} /> */}

        <div className="dashboard tw:bg-green-500">
          <div className="dashboard__sidebar bg-white scroll-bar-1 ">
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
