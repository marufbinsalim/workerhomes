'use client'

import LoadingMessage from '@/components/common/loading'
import DwellingFormStep from '@/components/form/dwelling/others/step'
import useFetch from '@/hooks/useFetch'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'

const DwellingEditPage = ({ locale, id }) => {
  const [formState, setFormState] = React.useState(0)
  const [selected, setSelected] = React.useState(null)
  const t = useTranslations('dwellings')
  const router = useRouter()

  const { data, isLoading } = useFetch({
    url: `/api/dwellings/${id}`,
    keys: [id, 'dwellings'],
    query: {
      populate: [
        'icon',
        'subscription.package',
        'subscription.user',
        'guideline',
        'location.city',
        'location.country',
        'localizations',
        'contact',
        'prices',
        'amenities',
        'features',
        'galleries',
        'category',
        'seo',
        'contact',
        'owner',
        'package',
      ],
    },
  })

  return (
    <div className='form-page-container'>
      {isLoading ? (
        <LoadingMessage label={t('messages.loading')} />
      ) : (
        <DwellingFormStep
          formState={formState}
          setFormState={setFormState}
          formData={data}
          dwellingId={id}
          locale={locale}
          onSuccess={() => {
            router.push(`/${locale}/dashboard/dwellings`)
          }}
        />
      )}
    </div>
  )
}

export default DwellingEditPage
