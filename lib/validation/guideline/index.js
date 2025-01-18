import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const guidelineSchema = () => {
  const t = useTranslations('validation.guideline')
  return Yup.object().shape({
    title: Yup.string().required(t('title')),
    description: Yup.string()
      .min(10, t('description.min'))
      .max(30, t('description.max'))
      .default(''),
    pdf: Yup.mixed().required('PDF is required.'),
  })
}

export const initGuideline = values => {
  return {
    title: values?.title || '',
    description: values?.description || '',
    pdf: values?.pdf || '',
  }
}
