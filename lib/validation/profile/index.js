import { useYupLocale } from '@/hooks/useYupLocale'
import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

const passwordValidator = {
  regexp: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
  message: 'password.matches', // Use the translation key for the message
}

const locationSchema = () => {
  useYupLocale()

  return Yup.object().shape({
    street_one: Yup.string().required(),
    street_two: Yup.string(),
    zip_code: Yup.string(),
    city: Yup.string().required(),
    country: Yup.string().required(),
  })
}

export const profileSchema = () => {
  useYupLocale()

  return Yup.object().shape({
    email: Yup.string().email().required(),
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    businessAccount: Yup.boolean().required().default(false),
    company: Yup.string(),
    phone: Yup.string().required(),
    vat_number: Yup.string(),
    address: locationSchema(),
    isCard: Yup.boolean().required().default(true),
    isPaypal: Yup.boolean().required().default(true),
  })
}

export const profilePWDSchema = () => {
  const t = useTranslations('validation')

  return Yup.object().shape({
    current_password: Yup.string()
      .min(6, t('password.min'))
      .required(t('password.required')),
    password: Yup.string()
      .min(6, t('password.min'))
      .matches(passwordValidator.regexp, t(passwordValidator.message))
      .required(t('password.required')),
    confirm_password: Yup.string()
      .required(t('confirm_password.required'))
      .oneOf([Yup.ref('password'), null], t('confirm_password.oneOf')),
  })
}

export const initProfile = values => {
  return {
    email: values?.email || '',
    first_name: values?.first_name || '',
    last_name: values?.last_name || '',
    businessAccount: values?.businessAccount || false,
    company: values?.company || '',
    phone: values?.phone || '',
    vat_number: values?.vat_number || '',
    address: {
      street_one: values?.address?.street_one || '',
      street_two: values?.address?.street_two || '',
      zip_code: values?.address?.zip_code || '',
      city: values?.address?.city || '',
      country: values?.address?.country || '',
    },
    isCard: values?.isCard || true,
    isPaypal: values?.isPaypal || true,
  }
}

export const profilePWDVerifySchema = () => {
  const t = useTranslations('validation')

  return Yup.object().shape({
    password: Yup.string()
      .min(6, t('password.min'))
      .matches(passwordValidator.regexp, t(passwordValidator.message))
      .required(t('password.required')),
  })
}

export const paymentMethodSchema = () => {
  useYupLocale()

  return Yup.object().shape({
    paymentMethod: Yup.string().required(),
  })
}

export const initPaymentMethod = values => {
  return {
    paymentMethod: values?.paymentMethod || 'card',
  }
}
