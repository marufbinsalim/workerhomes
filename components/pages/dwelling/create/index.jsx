'use client'

import DwellingFormStep from '@/components/form/dwelling/others/step'
import { useRouter } from 'next/navigation'
import React from 'react'

const DwellingCreatePage = ({ locale }) => {
  const [formState, setFormState] = React.useState(0)
  const [selected, setSelected] = React.useState(null)
  const router = useRouter()
  return (
    <div className='form-page-container'>
      <DwellingFormStep
        formState={formState}
        setFormState={setFormState}
        formData={null}
        dwellingId={null}
        translate={false}
        locale={locale}
        onSuccess={() => {
          router.push('/dashboard/dwellings')
        }}
      />
    </div>
  )
}

export default DwellingCreatePage
