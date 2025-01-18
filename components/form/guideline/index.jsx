'use client'

import Input from '@/components/common/Input'
import PDFUploader from '@/components/common/PDFUploader'
import { create, update } from '@/lib/services/quideline'
import { guidelineSchema, initGuideline } from '@/lib/validation/guideline'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useState } from 'react'

const GuideLineForm = ({ formData, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Formik
      initialValues={initGuideline(formData)}
      enableReinitialize={true}
      validationSchema={guidelineSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true)

        const formattedValues = {
          ...values,
          id: formData?.id ? formData?.id : null,
          pdf: values?.pdf?.id ? values?.pdf?.id : null,
        }

        let res = null

        if (formData?.id) {
          res = await update(formattedValues, 'Guide line updated successfully')
        } else {
          res = await create(formattedValues, 'Guide line created successfully')
        }

        setIsLoading(false)
        if (res.status === 200 || res.status === 201) {
          onSuccess && onSuccess()
          resetForm()
        }
      }}
    >
      {({ dirty, values, errors, setFieldValue }) => (
        <Form>
          <div className='row x-gap-20 y-gap-20'>
            <div className='col-12'>
              <Input type='text' name='title' label='Title' />
            </div>

            <div className='col-12'>
              <Input
                rows={5}
                type='textarea'
                name='description'
                label='Description'
              />
            </div>

            <PDFUploader
              name='pdf'
              label='PDF'
              value={values?.pdf}
              onUpload={value => setFieldValue('pdf', value)}
            />

            <div className='modal-footer'>
              <button type='reset' className='col-auto button -sm border'>
                Rest
              </button>
              <button
                disabled={!dirty || Object.keys(errors).length > 0 || isLoading}
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
      )}
    </Formik>
  )
}

export default GuideLineForm
