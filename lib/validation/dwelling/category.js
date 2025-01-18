import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const dwellingCategorySchema = () => {
  const t = useTranslations('validation.dwelling-category')

  return Yup.object().shape({
    title: Yup.string().required(t('title')),
    description: Yup.string().required(t('description')),
    slug: Yup.string().required(t('slug')),
  })
}

export const initDwellingCategory = values => {
  return {
    title: values?.title || '',
    description: values?.description || '',
    slug: values?.slug || '',
  }
}
