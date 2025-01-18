import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const equipmentSchema = () => {
  const t = useTranslations('validation.dwelling-equipment')

  return Yup.object().shape({
    title: Yup.string().required(t('title')),
    description: Yup.string().required(t('description')),
    icon: Yup.mixed().required(t('icon')),
  })
}

export const initEquipment = values => {
  return {
    title: values?.title || '',
    description: values?.description || '',
    icon: values?.icon || '',
  }
}
