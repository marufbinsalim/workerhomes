'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'

const WhyChoose = () => {
  const t = useTranslations('about')

  const blockContent = [
    {
      id: 1,
      icon: '/img/featureIcons/3/1.svg',
      title: t('list.offer.1.title'),
      text: t('list.offer.1.description'),
      delayAnimation: '100',
    },
    {
      id: 2,
      icon: '/img/featureIcons/3/2.svg',
      title: t('list.offer.2.title'),
      text: t('list.offer.2.description'),
      delayAnimation: '200',
    },
    {
      id: 3,
      icon: '/img/featureIcons/3/3.svg',
      title: t('list.offer.3.title'),
      text: t('list.offer.3.description'),
      delayAnimation: '300',
    },
  ]
  return (
    <>
      {blockContent.map(item => (
        <div
          className='col-lg-3 col-sm-6'
          key={item.id}
          data-aos='fade'
          data-aos-delay={item.delayAnimation}
        >
          <div className='featureIcon -type-1 '>
            <div className='d-flex justify-center'>
              <Image
                width={70}
                height={70}
                src={item.icon}
                alt='image'
                className='js-lazy'
              />
            </div>
            <div className='text-center mt-30'>
              <h4 className='text-18 fw-500'>{item.title}</h4>
              <p className='text-15 mt-10'>{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default WhyChoose
