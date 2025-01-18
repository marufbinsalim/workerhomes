'use client'

import Link from 'next/link'

import permissions from '@/config/permissions'
import { filterSidebarContent } from '@/config/sidebar'
import { isActiveLink } from '@/utils/linkActiveChecker'
import { Icon } from '@iconify/react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useParams, usePathname } from 'next/navigation'
import { useState } from 'react'

const Sidebar = () => {
  const locale = useParams().locale
  const t = useTranslations('dashboard-sidebar')
  const pathname = usePathname()
  const { data } = useSession()

  const sidebarContent = filterSidebarContent(
    locale,
    t,
    permissions,
    data?.role
  )
  const [open, setOpen] = useState(1)

  return (
    <div className='sidebar -dashboard'>
      {sidebarContent.map(item => (
        <div className='sidebar__item' key={item.id}>
          <div
            className={`${
              isActiveLink(item.routePath, pathname) ||
              (item?.submenu && open === item.id)
                ? '-is-active'
                : ''
            } sidebar__button `}
            onClick={() => setOpen(item.id)}
          >
            <Link
              href={item.routePath}
              className='d-flex items-center justify-between text-15 lh-1 w-100'
            >
              <div className='d-flex items-center'>
                <Icon
                  icon={item.icon}
                  className='mr-15'
                  width={20}
                  height={20}
                />
                {item.name}
              </div>
              {item.submenu?.length > 0 && (
                <Icon
                  icon={
                    open === item.id
                      ? 'icon-park-outline:down'
                      : 'icon-park-outline:right'
                  }
                  width={20}
                  height={20}
                />
              )}
            </Link>
          </div>
          <div>
            {item.submenu && (
              <SubMenuItem
                open={open === item.id}
                items={item.submenu}
                pathname={pathname}
              />
            )}
          </div>
        </div>
      ))}

      {/* <div className='sidebar__item'>
        <div className='sidebar__button' onClick={signOut}>
          <span className='d-flex items-center text-15 lh-1 fw-500'>
            <a href='#'>
              <div className='d-flex items-center'>
                <Icon
                  icon='solar:logout-3-outline'
                  className='mr-15'
                  width={20}
                  height={20}
                />
                {t('logout')}
              </div>
            </a>
          </span>
        </div>
      </div> */}
    </div>
  )
}

export default Sidebar

const SubMenuItem = ({ open, items, pathname }) => {
  return (
    <div className={`sidebar__submenu${open ? '--active' : ''}`}>
      <div className='sidebar__submenu__content'>
        {items?.length > 0 &&
          items?.map((item, i) => (
            <Link
              key={i}
              href={item.routePath}
              className={`sidebar__submenu__content__item text-15 lh-1 fw-500 ${
                isActiveLink(item.routePath, pathname)
                  ? 'submenu__item__active'
                  : ''
              }`}
            >
              <Icon icon={item?.icon} width={16} height={16} />
              {item.name}
            </Link>
          ))}
      </div>
    </div>
  )
}
