import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const subscriptionSchema = () => {
  const t = useTranslations('validation.subscription')
  return Yup.object().shape({
    package: Yup.mixed().required(t('package')),
    start_date: Yup.date().required(t('start_date')),
    end_date: Yup.date().required(t('end_date')),
    isExpired: Yup.boolean().default(false),

    stripe_customer_id: Yup.string().default(''),
    stripe_subscription_id: Yup.string().default(''),
  })
}

export const initSubscription = values => {
  return {
    user: values?.user || '',
    package: values?.package || '',
    start_date: values?.start_date || '',
    end_date: values?.end_date || '',
    isExpired: values?.isExpired || false,

    stripe_customer_id: values?.stripe_customer_id || '',
    stripe_subscription_id: values?.stripe_subscription_id || '',
  }
}
