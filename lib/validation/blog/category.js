import * as Yup from 'yup'

export const blogCategorySchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  slug: Yup.string().required('Slug is required'),
})

export const initBlogCategory = values => {
  return {
    title: values?.title || '',
    description: values?.description || '',
    slug: values?.slug || '',
  }
}
