import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

export const dwellingSchema = () => {
  const t = useTranslations('validation.dwelling')

  return Yup.object().shape({
    title: Yup.string().required(t('title')),
    description: Yup.string()
      .min(50, t('description.min'))
      .required(t('description.required')),
    status: Yup.string(),
    slug: Yup.string().required(t('slug')),

    isTrended: Yup.boolean().default(false),
    isPopulared: Yup.boolean().default(false),
    isApproved: Yup.boolean().default(false),
    isRecommended: Yup.boolean().default(false),

    category: Yup.mixed().required(t('category')),
    owner: Yup.mixed(),
    guidline: Yup.mixed(),

    amenities: Yup.array(),
    features: Yup.array().min(1).required(t('features')),

    amIOwner: Yup.boolean().default(false),

    package: Yup.mixed().required(t('package')),
    subscription: Yup.mixed(),
  })
}

export const initDwelling = values => {
  return {
    title: values?.title || '',
    description: values?.description || '',
    status: values?.status || '',
    slug: values?.slug || '',
    isTrended: values?.isTrended || false,
    isPopulared: values?.isPopulared || false,
    isRecommended: values?.isRecommended || false,
    isApproved: values?.isApproved || false,
    category: values?.category || '',
    guidline: values?.guidline || '',
    owner: values?.owner || '',
    package: values?.package || '',
    subscription: values?.subscription || '',
    amenities: values?.amenities || [],
    features: values?.features || [],
    isFreePlanAssigned: values?.isFreePlanAssigned,

    amIOwner: values?.owner?.id ? true : false,
  }
}
