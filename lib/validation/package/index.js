import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

const rolesSchema = Yup.object().shape({
  pics: Yup.number().default(1),
  website: Yup.boolean().default(false),
  facebook: Yup.boolean().default(false),
  featured: Yup.boolean().default(false),
  instagram: Yup.boolean().default(false),
  google_listing: Yup.boolean().default(false),
  search_position: Yup.string().default('0'),
  visibility_radius: Yup.string().default('0'),
})

export const packageSchema = () => {
  const t = useTranslations('validation.package')

  return Yup.object().shape({
    name: Yup.string().required(t('name')),
    isPopulared: Yup.boolean().default(false),
    isTrended: Yup.boolean().default(false),
    pics: Yup.number().default(1),
    price: Yup.number().default(0),
    description: Yup.string().required(),
    locale: Yup.string().default('en'),
    roles: rolesSchema,
    visibility_radius: Yup.string().default('0'),
    search_position: Yup.string().default('0'),
    icon: Yup.mixed().required(t('icon')),
    iconSize: Yup.number().required(t('iconSize')),
    order: Yup.number().required(t('order')),
  })
}

export const initPackage = values => {
  return {
    name: values?.name || '',
    isPopulared: values?.isPopulared || false,
    price: values?.price || 0,
    description: values?.description || '',
    isTrended: values?.isTrended || false,
    pics: values?.pics || 1,
    locale: values?.locale || 'en',
    isFeatured: values?.isFeatured,
    visibility_radius: values?.visibility_radius || '0',
    search_position: values?.search_position || '0',
    icon: values?.icon || '',
    iconSize: values?.iconSize || 0,
    order: values?.order || 1,
    roles: {
      pics: values?.roles?.pics || 0,
      website: values?.roles?.website || false,
      facebook: values?.roles?.facebook || false,
      featured: values?.roles?.featured || false,
      instagram: values?.roles?.instagram || false,
      google_listing: values?.roles?.google_listing || false,
      search_position: values?.roles?.search_position || 0,
      visibility_radius: values?.roles?.visibility_radius || 0,
    },
  }
}
