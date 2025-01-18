import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const priceSchema = () => {
  const t = useTranslations('prices')

  return Yup.object().shape({
    amount: Yup.string(),
    type: Yup.string(),
    // type: Yup.string().required(t('type')),
    guest: Yup.number(),
    adult: Yup.number(),
    min_stay: Yup.number(),
    note: Yup.string().default(''),
    total: Yup.number().required(t('total')).default(1),
  })
}

export const initPrice = values => {
  return {
    amount: values?.amount || '',
    type: values?.type || '',
    guest: values?.guest || 1,
    adult: values?.adult || 1,
    min_stay: values?.min_stay || 1,
    note: 'PER NIGHT',
    total: values?.total || 1,
  }
}
