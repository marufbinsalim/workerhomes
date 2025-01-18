import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const amenitySchema = () => {
  const t = useTranslations('validation.amenity')

  return Yup.object().shape({
    title: Yup.string().required(t('title')),
    description: Yup.string().required(t('description')),
  })
}

export const initAmenity = values => {
  return {
    title: values?.title || '',
    description: values?.description || '',
  }
}
