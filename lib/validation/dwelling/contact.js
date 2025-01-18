import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const dwellingContactSchema = () => {
  const t = useTranslations('validation.dwelling-contact')

  return Yup.object().shape({
    name_or_company: Yup.string().required(t('name_or_company')),
    email: Yup.string().email(t('invalid-email')).required(t('email')),
    phone: Yup.string().required(t('phone')),
    check_in: Yup.string().required(t('check_in')),
    check_out: Yup.string().required(t('check_out')),
    guests: Yup.string(),
    additional_information: Yup.string(),
  })
}

export const initDwellingContact = values => {
  return {
    name_or_company: values?.name_or_company || '',
    email: values?.email || '',
    phone: values?.phone || '',
    check_in: values?.check_in || '',
    check_out: values?.check_out || '',
    guests: values?.guests || '',
    additional_information: values?.additional_information,
  }
}
