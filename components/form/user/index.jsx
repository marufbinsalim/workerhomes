import Checkbox from '@/components/common/Checkbox'
import ComboBox from '@/components/common/ComboBox'
import ImageUploader from '@/components/common/ImageUploader'
import Input from '@/components/common/Input'
import { create, update } from '@/lib/services/user'
import { initUser, userSchema } from '@/lib/validation/user'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const UserForm = ({ formData, onSuccess, locale }) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('users')

  return (
    <Formik
      initialValues={initUser(formData)}
      enableReinitialize={true}
      validationSchema={userSchema()}
      onSubmit={async (values, { resetFrom }) => {
        setIsLoading(true)

        const formattedValues = {
          ...values,
          package: values?.package?.id ? values?.package?.id : null,
          role: values?.role?.id ? values?.role?.id : null,
          image: values?.image?.[0]?.id ? values?.image?.[0]?.id : null,
          id: formData?.id ? formData?.id : null,
        }

        if (!formattedValues?.image) {
          delete formattedValues.image
        }

        if (!formattedValues?.id) {
          delete formattedValues.id
        }

        if (!formattedValues?.package) {
          delete formattedValues.package
        }

        let res = null

        if (formData?.id) {
          res = await update(formattedValues, t('messages.update'))
        } else {
          res = await create(formattedValues, t('messages.create'))
        }

        setIsLoading(false)

        if (res.status === 200 || res.status === 201) {
          onSuccess()
          resetFrom()
        }
      }}
    >
      {({ dirty, values, errors, setFieldValue }) => (
        <Form>
          <div className='row x-gap-20 y-gap-20'>
            <div className='col-6'>
              <Input
                type='text'
                name='first_name'
                label='First Name'
                required
              />
            </div>

            <div className='col-6'>
              <Input type='text' name='last_name' label='Last Name' required />
            </div>

            <div className='col-6'>
              <Input type='text' name='email' label='Email Address' required />
            </div>

            <div className='col-6'>
              <Input type='text' name='username' label='Username' required />
            </div>

            <div className='col-6'>
              <Input type='text' name='password' label='Password' required />
            </div>

            <div className='col-6'>
              <ComboBox
                onChange={item => setFieldValue('role', item)}
                label='User Role'
                value={values?.role}
                placeholder='Search For Role'
                url='/api/users-permissions/roles'
                name='role'
                keyValue='name'
                error={errors?.role}
                isRole={true}
                required
              />
            </div>

            {/* <div className='col-12'>
              <ImageUploader
                label='Upload Profile Picture'
                onUpload={value => setFieldValue('image', value)}
                error={errors?.image}
                value={values?.image}
              />
            </div> */}

            <div className='col-6'>
              <Checkbox
                label='Confirmed'
                onChange={value => setFieldValue('confirmed', value)}
                value={values.confirmed}
                error={errors?.confirmed}
              />
            </div>
            <div className='col-6'>
              <Checkbox
                label='Blocked'
                onChange={value => setFieldValue('blocked', value)}
                value={values.blocked}
                error={errors?.blocked}
              />
            </div>

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

export default UserForm
