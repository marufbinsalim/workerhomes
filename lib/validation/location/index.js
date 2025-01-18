import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const locationSchema = () => {
  const t = useTranslations('validation.location')

  return Yup.object().shape({
    name: Yup.string().required(t('name')),
    order: Yup.number().default(10).required(t('order')),
    image: Yup.mixed().required(t('image')),
    country: Yup.string().required(t('country')),
    locale: Yup.string().default('en'),
    lat: Yup.number().default(0),
    lng: Yup.number().default(0),
    zip_code: Yup.string().default(''),
  })
}

export const initLocation = values => {
  return {
    name: values?.name || '',
    order: values?.order || 10,
    image: values?.image || '',
    country: values?.country || '',
    locale: values?.locale || 'en',
    lat: values?.lat || 0,
    lng: values?.lng || 0,
    zip_code: values?.zip_code || '',
  }
}
