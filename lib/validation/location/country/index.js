import * as Yup from 'yup'

export const countrySchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  code: Yup.string().required('Country code is required'),
  currency: Yup.string().required('Money currency is required'),
  locale: Yup.string().default('en'),
})

export const initCountry = values => {
  return {
    name: values?.name || '',
    code: values?.code || '',
    currency: values?.currency || '',
    locale: values?.locale || 'en',
  }
}
