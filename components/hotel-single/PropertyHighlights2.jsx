import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import ClaimButton from '../common/ClaimButton'
import ContactButton from '../common/ContactButton'
import Map from './Map'
import Link from 'next/link'
import { spokenLanguages } from '@/config'
import { useParams } from 'next/navigation'

const PropertyHighlights2 = ({ data, dwelling }) => {
  const t = useTranslations('header')
  const t2 = useTranslations('single-listing')
  const locale = useParams().locale

  const highlightsContent = [
    {
      id: 1,
      key: 'WHATSAPP',
      icon: 'ic:twotone-whatsapp',
    },
    {
      id: 2,
      key: 'WEBSITE',
      icon: 'fluent-mdl2:website',
    },
    {
      id: 3,
      key: 'FACEBOOK',
      icon: 'mdi:facebook',
    },
    {
      id: 4,
      key: 'INSTAGRAM',
      icon: 'ri:instagram-line',
    },
  ]

  const result = highlightsContent
    ?.map(item => {
      const founded = data?.find(i => i.type === item.key)
      if (founded) {
        return {
          id: item.id,
          icon: item.icon,
          key: item.key,
          text: founded?.value,
        }
      }
    })
    ?.filter(i => i !== undefined)

  return (
    <div className='px-30 py-30 border-light rounded-4 '>
      <div className='text-18 fw-500 pb-10'>{t2('location-detail')}</div>
      <Map title={t2('map')} />
      <div className='container mt-20 mb-20'>
        <div className='border-top-light'></div>
      </div>

      <div className='text-18 fw-500 pb-10'>{t2('contact-detail')}</div>

      {result?.length > 0 ? (
        result?.map(item => {
          return (
            <div className='row x-gap-20 y-gap-20' key={item?.id}>
              <div className='col-auto'>
                <Icon icon={item?.icon} className={`text-24 text-blue-1`} />
              </div>
              <div className='col-auto'>
                <div className='text-15'>
                  <a
                    href={`${
                      item?.key === 'WHATSAPP'
                        ? `https://wa.me/${item?.text}`
                        : item?.text
                    }`}
                    target='__blank'
                  >
                    {item?.key === 'WHATSAPP'
                      ? item?.text
                      : 'Click here to visit'}
                  </a>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div>{t2('no-contact')}</div>
      )}

      <div className='container mt-20 mb-20'>
        <div className='border-top-light'></div>
      </div>
      <div className='text-18 fw-500 pb-10'>{t2('owner-detail')}</div>
      {dwelling?.owner?.id ? (
        <div>
          <div className='row x-gap-20 y-gap-0'>
            <div className='col-12'>
              {dwelling?.owner?.first_name + ' ' + dwelling?.owner?.last_name}
            </div>
            <a
              href={`mailto:${dwelling?.owner?.email}`}
              className='col-12 text-brand'
            >
              {dwelling?.owner?.email}
            </a>
          </div>
        </div>
      ) : (
        <div>{t2('no-owner')}</div>
      )}

      <div className='mt-20'>
        {!dwelling?.owner?.id && <ClaimButton dwelling={dwelling} />}
      </div>

      <div className='mt-20'>
        {dwelling?.owner?.id && <ContactButton dwelling={dwelling} />}

        <div className='text-14 fw-500 py-10'>
          {t2('service')}:{' '}
          <span className='badge'>
            {
              spokenLanguages?.find(
                i => i?.locale === dwelling?.service_lang
              )?.[locale]
            }
          </span>
        </div>
      </div>
    </div>
  )
}

export default PropertyHighlights2
