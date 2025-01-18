'use client'

import Link from '@/components/common/Link'

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import {
  homeItems,
  blogItems,
  pageItems,
  dashboardItems,
  categorieMobileItems,
  categorieMegaMenuItems,
} from '../../data/mainMenuData'
import { isActiveLink } from '../../utils/linkActiveChecker'
import Social from '../common/social/Social'
import ContactInfo from './ContactInfo'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { brand } from '@/config'
import { exactPath } from '@/utils'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import LanguageMegaMenu from './LanguageMegaMenu'
const MobileMenu = ({ user }) => {
  const pathname = usePathname()
  const locale = useParams().locale
  const t = useTranslations('header')
  const [isActiveParent, setIsActiveParent] = useState(false)
  const [isActiveNestedParentTwo, setisActiveNestedParentTwo] = useState(false)
  const [isActiveNestedParent, setisActiveNestedParent] = useState(false)

  const router = useRouter()

  useEffect(() => {
    categorieMegaMenuItems.map(megaMenu => {
      megaMenu?.menuCol?.map(megaCol => {
        megaCol?.menuItems?.map(item => {
          item?.menuList?.map(list => {
            if (list.routePath?.split('/')[1] == pathname.split('/')[1]) {
              setIsActiveParent(true)
              setisActiveNestedParentTwo(item?.title)
              setisActiveNestedParent(megaMenu?.id)
            }
          })
        })
      })
    })
  }, [])

  return (
    <>
      <div className='pro-header d-flex align-items-center justify-between border-bottom-light'>
        <Link href='/'>
          <Image
            src={exactPath(brand.logo.light)}
            alt='logo icon'
            width={150}
            height={20}
          />
        </Link>
        {/* End logo */}

        <div
          className='fix-icon'
          data-bs-dismiss='offcanvas'
          aria-label='Close'
        >
          <i className='icon icon-close'></i>
        </div>
        {/* icon close */}
      </div>
      {/* End pro-header */}

      <Sidebar width='400' backgroundColor='#fff'>
        <Menu>
          {/* <SubMenu
            label='Categories'
            className={isActiveParent ? 'menu-active-link' : ''}
          >
            {categorieMobileItems.map(item => (
              <SubMenu
                label={item.title}
                key={item.id}
                className={
                  isActiveNestedParent == item.id
                    ? 'menu-active-link'
                    : 'inactive-menu'
                }
              >
                {item.menuItems.map(single => (
                  <SubMenu
                    label={single.title}
                    key={single.id}
                    className={
                      isActiveNestedParentTwo == single.title
                        ? 'menu-active-link'
                        : 'inactive-menu'
                    }
                  >
                    {single.menuList.map((menu, i) => (
                      <MenuItem
                        key={i}
                        onClick={() => router.push(menu.routePath)}
                        className={
                          isActiveLink(menu.routePath, pathname)
                            ? 'menu-active-link'
                            : 'inactive-menu'
                        }
                      >
                        {menu.name}
                      </MenuItem>
                    ))}
                  </SubMenu>
                ))}
              </SubMenu>
            ))}
          </SubMenu> */}
          {/* End  All Categories Menu */}

          <MenuItem
            className={pathname === `${locale}/` ? 'menu-active-link' : ''}
          >
            <Link href='/'>{t('links.home')}</Link>
          </MenuItem>
          {/* End  Desitinations Menu */}

          <MenuItem
            className={
              pathname === `${locale}/pricing` ? 'menu-active-link' : ''
            }
          >
            <Link href='/pricing'>{t('links.pricing')}</Link>
          </MenuItem>

          <MenuItem
            className={
              pathname === `${locale}/bookmarks` ? 'menu-active-link' : ''
            }
          >
            <Link href='/bookmarks'>{t('links.bookmarks')}</Link>
          </MenuItem>

          <MenuItem
            className={pathname === `${locale}/blogs` ? 'menu-active-link' : ''}
          >
            <Link href='/blogs'>{t('links.blogs')}</Link>
          </MenuItem>

          <MenuItem
            className={
              pathname === `${locale}/contact` ? 'menu-active-link' : ''
            }
          >
            <Link href='/contact'>{t('links.contact')}</Link>
          </MenuItem>
          <MenuItem>
            <span className='d-flex gap-2 w-100 justify-content-between align-items-center'>
              <span>Change Language</span>
              <span>
                <LanguageMegaMenu textClass='text-dark-1' />
              </span>
            </span>
          </MenuItem>
          {/* End Contact  Menu */}
        </Menu>
      </Sidebar>

      <div className='mobile-footer px-20 py-5 border-top-light'></div>

      <div className='pro-footer'>
        <ContactInfo />

        <div className='mt-10'>
          <h5 className='text-16 fw-500 mb-10'>Follow us on social media</h5>
          <div className='d-flex x-gap-20 items-center'>
            <Social />
          </div>
        </div>
        <div className='mt-20'>
          <Link
            className=' button -dark-1 px-30 fw-400 text-14 bg-blue-1 h-50 text-white'
            href={user?.id ? '/dashboard/dwellings' : '/login'}
          >
            {t('button.sign')}
          </Link>
        </div>
      </div>
      {/* End pro-footer */}
    </>
  )
}

export default MobileMenu
