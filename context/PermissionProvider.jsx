'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import permissionsConfig from '@/config/permissions'
import AccessDenied from '@/components/common/AccessDenied'
import Verify from '@/components/common/Verify'

const PermissionsContext = createContext()

export const PermissionsProvider = ({ children, locale }) => {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [permissions, setPermissions] = useState({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  useEffect(() => {
    if (session?.role && pathname && locale) {
      const role = session.role
      const localizedPath = pathname.replace(`/${locale}`, '')

      const newPermissions = {
        read: checkPermission('read', role, localizedPath),
        create: checkPermission('create', role, localizedPath),
        update: checkPermission('update', role, localizedPath),
        delete: checkPermission('delete', role, localizedPath),
      }
      setPermissions(newPermissions)
    }
  }, [session, pathname, locale])

  const checkPermission = (action, role, path) => {
    const paths = Object.keys(permissionsConfig[action])
    for (const p of paths) {
      const regexPath = p.replace(/:\w+/g, '\\w+').replace(/\*/g, '.*')
      if (new RegExp(`^${regexPath}$`).test(path)) {
        return permissionsConfig[action][p].includes(role)
      }
    }
    return false
  }

  return (
    <PermissionsContext.Provider value={permissions}>
      {status === 'loading' ? (
        <Verify />
      ) : permissions.read && status === 'authenticated' ? (
        children
      ) : (
        <AccessDenied />
      )}
    </PermissionsContext.Provider>
  )
}

export const usePermissions = () => {
  return useContext(PermissionsContext)
}
