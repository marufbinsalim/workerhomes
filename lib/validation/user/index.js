import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const userSchema = () => {
  const t = useTranslations('validation.user')

  return Yup.object().shape({
    first_name: Yup.string().required(t('first_name')),
    last_name: Yup.string().required(t('last_name')),
    email: Yup.string().email(t('invalid-email')).required(t('email')),
    username: Yup.string()
      .lowercase()
      .matches(/[a-z]/, t('username.lowercase'))
      .required(t('username.required')),
    password: Yup.string()
      .min(6, t('password.min'))
      .matches(/[a-z]/, t('password.lowercase'))
      .matches(/[A-Z]/, t('password.uppercase'))
      .matches(/[0-9]/, t('password.number'))
      .matches(/[!@#$%^&*(),.?":{}|<>]/, t('password.symbol'))
      .required(t('password.required')),
    // image: Yup.mixed(),
    confirmed: Yup.boolean().default(true),
    blocked: Yup.boolean().default(false),
    role: Yup.mixed().required(t('role')),
    package: Yup.mixed(),
  })
}

export const initUser = values => {
  return {
    first_name: values?.first_name || '',
    last_name: values?.last_name || '',
    username: values?.username || '',
    password: values?.password || '',
    // image: values?.image || '',
    confirmed: values?.confirmed || true,
    blocked: values?.blocked || false,
    role: values?.role || '',
    email: values?.email || '',
    package: values?.package || '',
  }
}
