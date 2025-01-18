import ImageUploader from '@/components/common/ImageUploader'
import Input from '@/components/common/Input'
import { modify } from '@/lib/services/dwelling/price'
import { initPrice, priceSchema } from '@/lib/validation/dwelling/price'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

const PriceForm2 = forwardRef(
  ({ assignedType, formData, onSuccess, data }, ref) => {
    const [isLoading, setIsLoading] = useState(false)
    const [minStay, setMinStay] = useState(1)
    const t = useTranslations('prices')
    const tType = useTranslations('accommodation-types')

    const handleSubmit = async (values, { resetForm }) => {
      const filteredValues = values.accommodations
        .filter(acc => acc.amount > 0)
        .map(acc => ({
          id: acc.id || null,
          amount: parseInt(acc.amount),
          guest: parseInt(acc.guest),
          min_stay: parseInt(minStay || 1),
          total: parseInt(acc.total),
          type: acc.type,
          dwellings: formData?.dwelling,
          note: 'PER NIGHT',
        }))

      if (filteredValues.length === 0) {
        toast.warn(t('messages.required'))
        return
      }
      try {
        const res = await modify(
          formData?.dwelling,
          filteredValues,
          ''
          // t('messages.update')
        )

        if (![200, 201, 204].includes(res?.status)) {
          throw new Error(`Failed to save accommodation: ${accommodation.type}`)
        }

        onSuccess()
        resetForm()
      } catch (error) {
        console.error('Error submitting form:', error)
      }

      setIsLoading(false)
    }

    const accommodationTypes = [
      { label: tType('SINGLE ROOMS'), value: 'SINGLE ROOMS' },
      { label: tType('DOUBLE ROOMS'), value: 'DOUBLE ROOMS' },
      { label: tType('SHARED ROOMS'), value: 'SHARED ROOMS' },
      { label: tType('WHOLE ACCOMMODATION'), value: 'WHOLE ACCOMMODATION' },
    ]

    const initializeAccommodationData = () => {
      return accommodationTypes.map(type => {
        const existingData = data?.find(d => d.type === type.value)

        if (type?.value === 'SINGLE ROOMS') {
          return {
            id: existingData?.id,
            type: type.value,
            amount: existingData?.amount ? existingData.amount : 0,
            guest: 1,
            total: existingData?.total ? existingData.total || 0 : 0,
            disabled: true,
          }
        } else if (type?.value === 'DOUBLE ROOMS') {
          return {
            id: existingData?.id,
            type: type.value,
            amount: existingData?.amount ? existingData.amount : 0,
            guest: 2,
            total: existingData?.total ? existingData.total || 0 : 0,
            disabled: true,
          }
        } else {
          return {
            id: existingData?.id || null, // Include `id` if it exists, otherwise null
            type: type.value,
            amount: existingData?.amount ? existingData.amount : 0,
            guest: existingData?.guest ? existingData.guest : 0,
            total: existingData?.total ? existingData.total || 0 : 0,
          }
        }
      })
    }

    useEffect(() => {
      if (data?.length === 0) {
        setMinStay(1)
      } else {
        setMinStay(data?.[0]?.min_stay)
      }
    }, [data])

    return (
      <Formik
        initialValues={{
          accommodations: initializeAccommodationData(),
        }}
        validationSchema={priceSchema()}
        onSubmit={handleSubmit}
        innerRef={ref}
        enableReinitialize
      >
        {({ values, errors, dirty, setFieldValue }) => (
          <Form className='row justify-end x-gap-10 y-gap-10'>
            {values?.accommodations?.map((acc, idx) => (
              <div
                key={idx}
                className='row x-gap-10 y-gap-10 items-center justify-center'
              >
                <div className='col-md-3 col-12'>
                  <label className='form-label'>
                    {accommodationTypes[idx].label}
                  </label>
                </div>
                <div className='col-md-3 col-12'>
                  <Input
                    type='number'
                    name={`accommodations[${idx}].amount`}
                    label={t('form.fields.price')}
                    value={acc.amount}
                    required
                    onChange={e =>
                      setFieldValue(
                        `accommodations[${idx}].amount`,
                        e.target.value
                      )
                    }
                    min={0}
                  />
                </div>

                <div className='col-md-3 col-12'>
                  <Input
                    type='number'
                    name={`accommodations[${idx}].guest`}
                    label={t('form.fields.guest')}
                    value={acc.guest}
                    onChange={e =>
                      setFieldValue(
                        `accommodations[${idx}].guest`,
                        e.target.value
                      )
                    }
                    disabled={acc.disabled}
                    min={0}
                  />
                </div>
                <div className='col-md-3 col-12'>
                  <Input
                    type='number'
                    name={`accommodations[${idx}].total`}
                    label={t('form.fields.rooms')}
                    value={acc.total}
                    onChange={e =>
                      setFieldValue(
                        `accommodations[${idx}].total`,
                        e.target.value
                      )
                    }
                    min={0}
                  />
                </div>
              </div>
            ))}
            <div className='col-3'>
              <Input
                type='number'
                name={'min_stay'}
                label={t('form.fields.min_stay')}
                value={minStay}
                onChange={e => setMinStay(e.target.value)}
                min={0}
              />
            </div>
          </Form>
        )}
      </Formik>
    )
  }
)

export default PriceForm2

// import ImageUploader from '@/components/common/ImageUploader'
// import Input from '@/components/common/Input'
// import { modify } from '@/lib/services/dwelling/price'
// import { initPrice, priceSchema } from '@/lib/validation/dwelling/price'
// import { Icon } from '@iconify/react'
// import { Form, Formik } from 'formik'
// import { useTranslations } from 'next-intl'
// import { useState } from 'react'
// import { toast } from 'react-toastify'

// const PriceForm2 = ({ assignedType, formData, onSuccess, data }) => {
//   const [isLoading, setIsLoading] = useState(false)
//   const t = useTranslations('prices')
//   const tType = useTranslations('accommodation-types')

//   const handleSubmit = async (values, { resetForm }) => {
//     // setIsLoading(true)

//     const filteredValues = values.accommodations
//       .filter(acc => acc.amount > 0)
//       .map(acc => ({
//         id: acc.id || null,
//         amount: parseInt(acc.amount),
//         guest: parseInt(acc.guest),
//         min_stay: parseInt(acc.min_stay),
//         total: parseInt(acc.total),
//         type: acc.type,
//         dwellings: formData?.dwelling,
//         note: 'PER NIGHT',
//       }))

//     if (filteredValues.length === 0) {
//       toast.warn(t('messages.required'))
//       return
//     }
//     try {
//       const res = await modify(
//         formData?.dwelling,
//         filteredValues,
//         t('messages.update')
//       )

//       // Check if any of the operations failed
//       if (![200, 201, 204].includes(res?.status)) {
//         throw new Error(`Failed to save accommodation: ${accommodation.type}`)
//       }

//       // If all updates/creates were successful
//       onSuccess()
//       resetForm()
//     } catch (error) {
//       console.error('Error submitting form:', error)
//     }

//     setIsLoading(false)
//   }

//   // Accommodation options
//   const accommodationTypes = [
//     { label: tType('SINGLE ROOMS'), value: 'SINGLE ROOMS' },
//     { label: tType('DOUBLE ROOMS'), value: 'DOUBLE ROOMS' },
//     { label: tType('SHARED ROOMS'), value: 'SHARED ROOMS' },
//     { label: tType('WHOLE ACCOMMODATION'), value: 'WHOLE ACCOMMODATION' },
//   ]

//   // Initialize accommodation data by checking if backend data exists for each type
//   const initializeAccommodationData = () => {
//     return accommodationTypes.map(type => {
//       const existingData = data?.find(d => d.type === type.value)
//       return {
//         id: existingData?.id || null, // Include `id` if it exists, otherwise null
//         type: type.value,
//         amount: existingData ? existingData.amount : 0,
//         guest: existingData ? existingData.guest : 0,
//         min_stay: existingData ? existingData.min_stay : 0,
//         total: existingData ? existingData.total || 0 : 0,
//       }
//     })
//   }

//   return (
//     <Formik
//       initialValues={{
//         accommodations: initializeAccommodationData(),
//       }}
//       validationSchema={priceSchema()}
//       onSubmit={handleSubmit}
//     >
//       {({ values, errors, dirty, setFieldValue }) => (
//         <Form>
//           {values?.accommodations?.map((acc, idx) => (
//             <div key={idx}>
//               <div className='col-md-2 col-12'>
//                 <label className='form-label'>
//                   {accommodationTypes[idx].label}
//                 </label>
//               </div>
//               <div className='row x-gap-20 y-gap-20'>
//                 <div className='col-md-3 col-12'>
//                   <Input
//                     type='number'
//                     name={`accommodations[${idx}].amount`}
//                     label={t('form.fields.price')}
//                     value={acc.amount}
//                     required
//                     onChange={e =>
//                       setFieldValue(
//                         `accommodations[${idx}].amount`,
//                         e.target.value
//                       )
//                     }
//                   />
//                 </div>

//                 <div className='col-md-3 col-12'>
//                   <Input
//                     type='number'
//                     name={`accommodations[${idx}].guest`}
//                     label={t('form.fields.guest')}
//                     value={acc.guest}
//                     onChange={e =>
//                       setFieldValue(
//                         `accommodations[${idx}].guest`,
//                         e.target.value
//                       )
//                     }
//                   />
//                 </div>

//                 <div className='col-md-3 col-12'>
//                   <Input
//                     type='number'
//                     name={`accommodations[${idx}].min_stay`}
//                     label={t('form.fields.min_stay')}
//                     value={acc.min_stay}
//                     onChange={e =>
//                       setFieldValue(
//                         `accommodations[${idx}].min_stay`,
//                         e.target.value
//                       )
//                     }
//                   />
//                 </div>

//                 <div className='col-md-3 col-12'>
//                   <Input
//                     type='number'
//                     name={`accommodations[${idx}].total`}
//                     label={t('form.fields.rooms')}
//                     value={acc.total}
//                     onChange={e =>
//                       setFieldValue(
//                         `accommodations[${idx}].total`,
//                         e.target.value
//                       )
//                     }
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}

//           <div className='modal-footer d-flex gap-4'>
//             <button
//               disabled={isLoading}
//               type='submit'
//               className='col-auto button -sm bg-blue-1 text-white'
//             >
//               {formData?.id ? t('edit') : t('create')}
//               <Icon
//                 icon={
//                   isLoading
//                     ? 'line-md:loading-loop'
//                     : formData?.id
//                     ? 'mage:edit-fill'
//                     : 'ph:plus-bold'
//                 }
//                 className='ml-10'
//                 width={15}
//                 height={15}
//               />
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   )
// }

// export default PriceForm2
