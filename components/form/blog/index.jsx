import Checkbox from '@/components/common/Checkbox'
import ComboBox from '@/components/common/ComboBox'
import ImageUploader from '@/components/common/ImageUploader'
import Input from '@/components/common/Input'
import TextEditor from '@/components/common/TextEditor'
import { api, roles } from '@/config'
import { create, translate, update } from '@/lib/services/blog'
import { blogSchema, initBlog } from '@/lib/validation/blog'
import { genSlug, getLocales } from '@/utils'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

const BlogForm = ({ formData, onSuccess, locale, translation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('blogs')
  const localeT = useTranslations('localizations')
  const [initData, setInitData] = useState(null)
  const localeOptions = getLocales(locale, formData?.localizations, localeT)

  const { data: session } = useSession()

  useEffect(() => {
    if (formData?.id && translation) {
      const newObject = {
        ...formData,
      }

      delete newObject?.category
      delete newObject?.title
      delete newObject?.description
      delete newObject?.slug

      setInitData(newObject)
    }
  }, [formData?.id])

  return (
    <Formik
      initialValues={initBlog(translation ? initData : formData)}
      enableReinitialize={true}
      validationSchema={blogSchema}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)

        const formattedValues = {
          ...values,
          id: formData?.id ? formData?.id : null,
          author: session?.id,
          seo: [
            {
              metaTitle: values.title,
              metaDescription: values.description?.slice(0, 160),
              metaImage: values?.images?.[0] || null,
              keywords: values?.keywords || values?.title,
              canonicalURL: api + '/blogs/' + values.slug,
              locale: values.locale || locale,
            },
          ],
        }

        let res = null

        if (formData?.id && !translation) {
          res = await update(formattedValues, t('messages.update'))
        } else if (formData?.id && translation) {
          res = await translate(formattedValues, t('messages.translate'))
        } else {
          res = await create(
            { ...formattedValues, locale, date: new Date() },
            t('messages.create')
          )
        }
        setIsLoading(false)

        if (res.status === 200 || res.status === 201) {
          onSuccess()
          resetForm()
        }
      }}
    >
      {({ dirty, values, errors, setFieldValue }) => {
        return (
          <Form>
            <div className='row x-gap-20 y-gap-20'>
              {translation && (
                <div className='col-12'>
                  <Input
                    required
                    label='Translation Language'
                    name='locale'
                    type='select'
                    options={localeOptions}
                  />
                </div>
              )}

              <div
                className={session?.role === roles.admin ? 'col-6' : 'col-12'}
              >
                <Input
                  type='text'
                  name='title'
                  label='Title'
                  required
                  onChange={e => {
                    setFieldValue('slug', genSlug(e.target.value))
                    setFieldValue('title', e.target.value)
                  }}
                />
              </div>

              {session?.role === roles.admin && (
                <div className='col-6'>
                  <Input type='text' name='slug' label='Slug' required />
                </div>
              )}

              <div className='col-12'>
                <ComboBox
                  onChange={item => setFieldValue('category', item)}
                  label='category'
                  value={values?.category}
                  placeholder='Search by title'
                  url='/api/blog-categories'
                  locale={values?.locale || locale}
                  name='category'
                  keyValue='title'
                  error={errors?.category}
                  required
                />
              </div>

              <div className='col-12'>
                <TextEditor
                  initialData={values?.description}
                  onChange={value => setFieldValue('description', value)}
                  error={errors?.description}
                />
              </div>

              <div className='col-6'>
                <Checkbox
                  label='Is Approved'
                  onChange={value => setFieldValue('isApproved', value)}
                  value={values.isApproved}
                  error={errors?.isApproved}
                />
              </div>

              <div className='col-6'>
                <ImageUploader
                  label='Blog header image'
                  onUpload={value => setFieldValue('image', value)}
                  error={errors?.image}
                  value={values?.image}
                />
              </div>

              <div className='modal-footer'>
                <button type='reset' className='col-auto button -sm border'>
                  Rest
                </button>
                <button
                  disabled={
                    !dirty || Object.keys(errors).length > 0 || isLoading
                  }
                  type='submit'
                  className='col-auto button -sm bg-blue-1 text-white'
                >
                  {formData?.id ? 'Update' : 'Create'}
                  <Icon
                    icon={
                      isLoading
                        ? 'line-md:loading-loop'
                        : formData?.id
                        ? 'mage:edit-fill'
                        : 'ph:plus-bold'
                    }
                    className='ml-10'
                    width={15}
                    height={15}
                  />
                </button>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default BlogForm
