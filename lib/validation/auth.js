import * as Yup from 'yup'

const passwordValidator = {
  regexp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/,
  message:
    'Password must contain at least one lowercase letter, one uppercase letter, and one symbol.',
}

export const authSchema = {
  signIn: Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  }),
  signUp: Yup.object().shape({
    first_name: Yup.string().uppercase().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .matches(passwordValidator.regexp, passwordValidator.message)
      .required('Password is required'),
    confirm_password: Yup.string()
      .required()
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  }),
  forgotPassword: Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  }),
  resetPassword: Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .matches(passwordValidator.regexp, passwordValidator.message)
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required()
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  }),
}
