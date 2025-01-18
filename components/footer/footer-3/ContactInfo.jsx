import { useTranslations } from 'next-intl'

const ContactInfo = () => {
  const t = useTranslations('footer')
  const contactContent = [
    {
      id: 1,
      title: t('customer.care'),
      action: 'tel:+48 22 1234567',
      text: '+48 12 1234567',
    },
    {
      id: 2,
      title: t('customer.support'),
      action: 'mailto:info@workerhomes.pl',
      text: 'info@workerhomes.pl',
    },
  ]
  return (
    <>
      {contactContent.map(item => (
        <div className='col-sm-6' key={item.id}>
          <div className={'text-14'}>{item.title}</div>
          <a href={item.action} className='text-18 fw-500 text-dark-1 mt-5'>
            {item.text}
          </a>
        </div>
      ))}
    </>
  )
}

export default ContactInfo
