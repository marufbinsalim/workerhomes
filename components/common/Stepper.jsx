'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

const Stepper = ({ children, onStepChange, error }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeStep = parseInt(searchParams.get('step')) || 0
  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === children.length - 1
  const t = useTranslations('dwellings')

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handlePrevStep = () => {
    if (activeStep === 0 || isFirstStep) return
    onStepChange(activeStep - 1)
    router.push(pathname + '?' + createQueryString('step', activeStep - 1))
  }

  const handleNextStep = () => {
    if (activeStep === children.length - 1 || isLastStep || error) return
    onStepChange(activeStep + 1)
    router.push(pathname + '?' + createQueryString('step', activeStep + 1))
  }

  const currentStep = children[activeStep]
  const currentStepActions = currentStep?.props?.actions
  const currentStepTitle = currentStep?.props?.title

  useEffect(() => {
    if (error) {
      onStepChange(1)
      router.push(pathname + '?' + createQueryString('step', 0))
    }
  }, [error])

  return (
    <div className='stepper'>
      <div className='tabs'>
        {children.map((child, index) => {
          if (!child) return null
          return (
            <div
              key={index}
              className={`tab text-14 ${activeStep === index ? 'active' : ''}`}
              // onClick={() => {
              //   if (error) return
              //   onStepChange(index)
              //   router.push(pathname + '?' + createQueryString('step', index))
              // }}
            >
              {child?.props?.title || ''}
            </div>
          )
        })}
      </div>
      <div className='step-content'>{currentStep}</div>
      <div
        className='buttons'
        style={{
          marginTop: currentStepActions ? '-70px' : '',
        }}
      >
        {!isFirstStep && (
          <button className='button' onClick={handlePrevStep}>
            <Icon icon='akar-icons:arrow-left' className='mr-10' />
            {t('control-panel.prev')}
          </button>
        )}
        {/* {!isLastStep && (
          <button className='button' onClick={handleNextStep}>
            Next
          </button>
        )} */}
      </div>
    </div>
  )
}

export default Stepper

export const Step = ({ children, title, actions = false }) => {
  return (
    <div className='step' data-title={title} data-actions={actions}>
      {children}
    </div>
  )
}
