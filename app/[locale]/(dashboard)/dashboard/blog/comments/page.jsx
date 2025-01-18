import ControlPanel from '@/components/common/controlPanel'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'blog-comments' })

  return {
    title: t('title'),
  }
}

const page = async () => {
  const t = await getTranslations('blog-comments')
  return (
    <>
      <ControlPanel title={t('title')} description={t('description')} />

      <div className='py-30 px-30 rounded-4 bg-white shadow-3'>
        <h3>Hello world</h3>
      </div>
    </>
  )
}

export default page
