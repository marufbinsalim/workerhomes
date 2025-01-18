import { exactPath } from '@/utils'

const BlockGuide2 = ({ t }) => {
  const blockContent = [
    {
      id: 1,
      title: t('list.choose.1.title'),
      text: t('list.choose.1.description'),
      icon: '/uploads/one_140e87200b.png',
      delayAnim: '100',
    },
    {
      id: 2,
      title: t('list.choose.2.title'),
      icon: '/uploads/two_550f593ad3.png',
      text: t('list.choose.2.description'),
      delayAnim: '200',
    },
    {
      id: 3,
      title: t('list.choose.3.title'),
      icon: '/uploads/three_c145d7e208.png',
      text: t('list.choose.3.description'),
      delayAnim: '300',
    },
    {
      id: 4,
      title: t('list.choose.4.title'),
      icon: '/uploads/four_1_a3b9da7d8e.png',
      text: t('list.choose.4.description'),
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

export default BlockGuide2
