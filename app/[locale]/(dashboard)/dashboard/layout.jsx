import Sidebar from '@/components/dashboard/dashboard/common/Sidebar'
import Header from '@/components/header/dashboard-header'
import { BreadcrumbProvider } from '@/context/Breadcrumb'
import { PermissionsProvider } from '@/context/PermissionProvider'

import { getCurrentUser } from '@/lib/session'

const DashboardLayout = async ({ params, children }) => {
  const user = await getCurrentUser()

  return (
    <BreadcrumbProvider>
      <PermissionsProvider locale={params?.locale}>
        <div className='header-margin'></div>

        <Header user={user} />

        <div className='dashboard'>
          <div className='dashboard__sidebar bg-white scroll-bar-1 '>
            <Sidebar />
          </div>

          <div className='dashboard__main'>
            <div className='dashboard__content bg-light-2 '>{children}</div>
          </div>
        </div>
      </PermissionsProvider>
    </BreadcrumbProvider>
  )
}
export default DashboardLayout
