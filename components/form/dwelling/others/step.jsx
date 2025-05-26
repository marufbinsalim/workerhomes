'use client'

import Stepper, { Step } from '@/components/common/Stepper'
import GalleryStepWrapper from '@/components/form/dwelling/others/StepWrapper'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import DwellingForm from '../index'
import DwellingSocialForm from '../social'
import { useSession } from 'next-auth/react'
import DwellingPaymentForm from '../payment'
import useFetch from '@/hooks/useFetch'
import { filter } from '@/data/blogs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import PackageSelector from '@/components/common/PackageSelector'

const DwellingFormStep = ({
  formData,
  translate,
  locale,
  onSuccess,
  formState,
  setFormState,
  dwellingId,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const { data: session } = useSession()
  const t = useTranslations('dwellings')
  const st = searchParams.get('step')
  const plan = searchParams.get('plan')

  useEffect(() => {
    if (formData?.id) {
      setFormState(formData)
    } else {
      setFormState(null)
    }
    setStep(0)
  }, [formData?.id])

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  useEffect(() => {
    if (plan && !formState?.package && !formState?.id) {
      setFormState(prevState => ({
        ...prevState,
        package: {
          id: plan,
        },
      }))
    }
  }, [plan])

  return (
    <Stepper
      activeStep={step}
      // error={data?.length === 0 && !dwellingId}
      onStepChange={step => {
        // if (step > 1 && (!data?.id || !dwellingId)) {
        //   toast.error('You need to subscribe to a plan before you can proceed.')
        // } else {
        //   setStep(step)
        //   const path = data?.id
        //     ? '/dashboard/dwellings'
        //     : `/dashboard/dwellings/${data?.id}`
        //   router.push(path + '?' + createQueryString('step', step))
        // }
      }}
    >
      {formState?.id || plan ? null : (
        <Step actions title={t('form.tabs.package')} >
          <div className='tw:flex tw:flex-col'>
            <div className='tw:mb-8 font-secondary'>
              <h1 className='tw:text-[20px] tw:font-semibold tw:mb-2 tw:text-[var(--color-font-dark)]'>Choose a plan</h1>
              <p className='tw:text-[var(--color-font-regular)] tw:text-[14px] tw:font-normal'>Choose a plan that's best suited for your need.</p>
            </div>
            <PackageSelector
              onChange={plan => {
                setFormState(prevState => ({
                  ...prevState,
                  package: plan,
                }))

                setStep(1)
                router.push(pathname + '?' + createQueryString('step', 1))
              }}
              value={formState?.package}
            />
          </div>


        </Step>
      )}
      <Step actions title={t('form.tabs.listing')}>
        <DwellingForm
          translation={translate}
          locale={locale}
          session={session}
          user={session?.id}
          formData={formState?.id ? formState : null}
          defaultPackage={formState?.package}
          onSuccess={data => {
            setFormState(data)
            setStep(2)

            return router.push(
              `/${locale}/dashboard/dwellings/form/${data?.id}?step=2`
            )
          }}
          plan={plan}
        />
      </Step>
      <Step actions title={t('form.tabs.source')}>
        <GalleryStepWrapper
          pics={formState?.package?.pics}
          formId={formState?.id || dwellingId}
          onSuccess={() => {
            setStep(3)

            router.push(pathname + '?' + createQueryString('step', 3))
          }}
          user={session?.id}
        />
      </Step>
      <Step actions title={t('form.tabs.social')}>
        <DwellingSocialForm
          formData={formData || formState}
          locale={locale}
          user={session?.id}
          onSuccess={() => {
            if (formState?.subscription?.id) {
              return router.push(`/${locale}/dashboard/dwellings`)
            } else {
              setStep(4)
              return router.push(pathname + '?' + createQueryString('step', 4))
            }
          }}
        />
      </Step>
      {!formState?.subscription?.id && (
        <Step title={t('form.tabs.payment')}>
          <DwellingPaymentForm
            formData={formState}
            user={session}
            onSuccess={() => {
              toast.success(t('messages.subscription'))
              return router.push(
                `/${locale}/dashboard/dwellings?payment=succeed`
              )

              // setStep(1)
              // router.push(pathname + '?' + createQueryString('step', 1))
            }}
          />
        </Step>
      )}
    </Stepper>
  )
}

export default DwellingFormStep
