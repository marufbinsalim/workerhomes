import * as Yup from 'yup'

export const claimSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required.'),
  last_name: Yup.string().required('Last Name is required.'),
  email: Yup.string().email('Email is invalid.').required('Email is required.'),
  description: Yup.string()
    .min(40, 'Your description must be at least 40 characters long.')
    .required('Content is required.'),
})

export const initClaim = values => {
  return {
    first_name: values?.first_name || '',
    last_name: values?.last_name || '',
    email: values?.email || '',
    description: values?.description || '',
  }
}
