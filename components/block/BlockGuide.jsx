import { exactPath } from '@/utils'

const BlockGuide = ({ t }) => {
  const blockContent = [
    {
      id: 1,
      icon: '/uploads/easy_4ff6ce1d1e.png',
      title: t('list.values.1.title'),
      text: t('list.values.1.description'),
      delayAnim: '100',
    },
    {
      id: 2,
      icon: '/uploads/trust_cf240023b0.png',
      title: t('list.values.2.title'),
      text: t('list.values.2.description'),
      delayAnim: '200',
    },
    {
      id: 3,
      icon: '/uploads/accessible_ce66db4798.png',
      title: t('list.values.3.title'),
      text: t('list.values.3.description'),
      delayAnim: '300',
    },
    {
      id: 4,
      icon: '/uploads/network_7311e6f545.png',
      title: t('list.values.4.title'),
      text: t('list.values.4.description'),
      delayAnim: '300',
    },
  ]
  return (
    <>
      {blockContent.map(item => (
        <div
          className='col-lg-3 col-sm-6'
          data-aos='fade'
          data-aos-delay={item.delayAnim}
          key={item.id}
        >
          <div className='featureIcon -type-1 '>
            <div className='d-flex justify-center'>
              <img
                src={exactPath(item.icon)}
                alt='image'
                className='js-lazy'
                width={75}
                height={75}
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

export default BlockGuide
