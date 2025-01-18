'use client'

import { createContext, useContext, useState } from 'react'

const BreadcrumbContext = createContext()

export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([])

  const updateBreadcrumbs = newBreadcrumbs => {
    setBreadcrumbs(newBreadcrumbs)
  }

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, updateBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export const useBreadcrumbs = () => useContext(BreadcrumbContext)
