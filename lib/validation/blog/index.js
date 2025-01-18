import * as Yup from 'yup'

export const blogSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string()
    .min(50, 'Blog content must be at least 50 characters long.')
    .required('Content is required.'),
  slug: Yup.string().required('Slug is required'),
  category: Yup.mixed().required('Category is required'),
  isApproved: Yup.boolean().default(false),
  image: Yup.mixed().required('Banner image is required'),
})

export const initBlog = values => {
  return {
    title: values?.title || '',
    description: values?.description || '',
    slug: values?.slug || '',
    category: values?.category || '',
    isApproved: values?.isApproved || false,
    image: values?.image || '',
  }
}
