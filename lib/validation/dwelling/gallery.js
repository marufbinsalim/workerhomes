import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const gallerySchema = () => {
  const t = useTranslations('galleries')

  return Yup.object().shape({
    order: Yup.number().required(t('order')),
    image: Yup.mixed().required(t('image')),
    dwelling: Yup.mixed().required(t('dwelling')),
    note: Yup.string(),
  })
}

export const initGallery = values => {
  return {
    order: values?.order || '',
    note: values?.note || '',
    image: values?.image || '',
    dwelling: values?.dwelling || '',
  }
}
