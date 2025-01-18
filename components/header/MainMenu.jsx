'use client'

import Link from '@/components/common/Link'

import {
  homeItems,
  blogItems,
  pageItems,
  dashboardItems,
} from '../../data/mainMenuData'
import CategoriesMegaMenu from './CategoriesMegaMenu'
import {
  isActiveParent,
  isActiveLink,
  isActiveParentChaild,
} from '../../utils/linkActiveChecker'

import { useParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

const MainMenu = ({ style = '' }) => {
  const locale = useParams().locale
  const pathname = usePathname()
  const t = useTranslations('header')
  const [isActiveParent, setIsActiveParent] = useState(false)

  return (
    <nav className='menu js-navList'>
      <ul className={`menu__nav ${style} -is-active`}>
        <li className={pathname === `/${locale}` ? 'current' : ''}>
          <Link href='/'>{t('links.home')}</Link>
        </li>

        <li className={pathname === `/${locale}/pricing` ? 'current' : ''}>
          <Link href='/pricing'>{t('links.pricing')}</Link>
        </li>

        <li className={pathname === `/${locale}/bookmarks` ? 'current' : ''}>
          <Link href='/bookmarks'>{t('links.bookmarks')}</Link>
        </li>

        <li className={pathname === `/${locale}/blogs` ? 'current' : ''}>
          <Link href='/blogs'>{t('links.blogs')}</Link>
        </li>

        <li className={pathname === `/${locale}/contact` ? 'current' : ''}>
          <Link href='/contact'>{t('links.contact')}</Link>
        </li>
      </ul>
    </nav>
  )
}

export default MainMenu
