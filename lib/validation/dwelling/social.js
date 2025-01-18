import * as Yup from 'yup'

const contactSchema = Yup.object().shape({
  type: Yup.string().required('Social type is required.'),
  value: Yup.string().required('Social link or value is required.'),
})

const locationSchema = Yup.object().shape({
  street_one: Yup.string().required('Street line one is required.'),
  street_two: Yup.string().default(' '),
  zip_code: Yup.string(),
  city: Yup.string().required('City is required.'),
  country: Yup.string(),
  state: Yup.string(),
  geo: Yup.object().shape({
    lat: Yup.number().required('Latitude is required.'),
    lng: Yup.number().required('Longitude is required.'),
  }),
})

export const socialSchema = Yup.object().shape({
  location: locationSchema,
  contact: Yup.array().of(contactSchema),
  direction: Yup.string(),
  service_lang: Yup.string().default('pl'),
})

export const initSocial = values => {
  return {
    direction: values?.direction || '',
    service_lang: values?.service_lang || 'pl',
    location: {
      street_one: values?.location?.[0]?.street_one || '',
      street_two: values?.location?.[0]?.street_two || '',
      zip_code: values?.location?.[0]?.zip_code || '',
      city: values?.location?.[0]?.city || '',
      country: values?.location?.[0]?.country || '',
      state: values?.location?.[0]?.state || '',
      geo: {
        lat: values?.location?.[0]?.geo?.lat || 0,
        lng: values?.location?.[0]?.geo?.lng || 0,
      },
    },
    contact: values?.contact || [],
  }
}
