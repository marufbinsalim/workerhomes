import * as Yup from 'yup'

export const paymentSchema = Yup.object().shape({
  subscription: Yup.mixed(),
  isFreePlanAssigned: Yup.boolean().default(true),
})

export const initPayment = values => {
  return {
    subscription: values?.subscription || '',
    isFreePlanAssigned: values?.is,
  }
}
