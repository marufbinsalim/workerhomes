import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const contactSchema = () => {
  const t = useTranslations('validation.contact')
  return Yup.object().shape({
    name: Yup.string().required(t('name')),
    email: Yup.string().email(t('invalid-email')).required(t('email')),
    subject: Yup.string().required(t('subject')),
    message: Yup.string().required(t('message')),
  })
}

export const initContact = values => {
  return {
    name: '',
    email: '',
    subject: '',
    message: '',
  }
}
