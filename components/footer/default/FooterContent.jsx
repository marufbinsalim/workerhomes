import Link from '@/components/common/Link'
import footerDataContent from '../../../data/footerContent'
import { useTranslations } from 'next-intl'

const FooterContent = () => {
  const t = useTranslations('footer')
  const content = footerDataContent(t)
  return (
    <>
      {content.map(item => (
        <div className='col-xl-2 col-lg-4 col-sm-6' key={item.id}>
          <h5 className='text-16 fw-500 mb-30'>{item.title}</h5>
          <div className='d-flex y-gap-10 flex-column'>
            {item.menuList.map((menu, i) => (
              <Link href={menu.routerPath} key={i}>
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default FooterContent
