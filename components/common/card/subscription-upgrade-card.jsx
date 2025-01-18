import React from 'react'
import CheckoutButton from '../CheckoutButton'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import UpgradePlanButton from '../UpgradeButton'

const SubscriptionUpgradeCard = ({
  item,
  subscription,
  className,
  dwelling,
  isForm,
  state,
  oldStrapiSubscriptionId,
  onSuccess,
}) => {
  const t = useTranslations('plan')

  let title = ''

  switch (item?.name) {
    case 'Free':
      title = t('options.free')
      break
    case 'Silver':
      title = t('options.silver')
      break
    case 'Gold':
      title = t('options.gold')
      break
    case 'Platinum':
      title = t('options.platinum')
      break
    default:
      title = item?.name
  }

  return (
    <div className={`subscription-card ${className}`}>
      <div>
        <h3 className='title'>{title}</h3>

        <h3 className='price-text'>
          {/* {state === 'upgrade' && item?.price !== 0 && (
            <sup className='text-danger fw-bold fs-5 text-decoration-line-through'>
              {item?.price}{' '}
            </sup>
          )} */}
          <span className='price'>{item?.price || 0}</span> zł /{' '}
          {t('features.month')}
        </h3>

        <ul className='features-list'>
          {item?.pics && (
            <li>
              <Icon icon='openmoji:check-mark' className='icon' />
              {t('features.list.picture')} ({item?.pics})
            </li>
          )}
          {item?.roles?.website && (
            <li>
              <Icon icon='openmoji:check-mark' className='icon' />
              {t('features.list.website')}
            </li>
          )}{' '}
          {item?.roles?.facebook && (
            <li>
              <Icon icon='openmoji:check-mark' className='icon' />
              {t('features.list.facebook')}
            </li>
          )}{' '}
          {item?.roles?.instagram && (
            <li>
              <Icon icon='openmoji:check-mark' className='icon' />

              {t('features.list.instagram')}
            </li>
          )}{' '}
          {item?.roles?.google_listing && (
            <li>
              <Icon icon='openmoji:check-mark' className='icon' />
              {t('features.list.google')}
            </li>
          )}{' '}
          {item?.roles?.search_position && (
            <li className='row text-left'>
              <span className='col-12'>
                <Icon icon='openmoji:check-mark' className='icon' />
                {t('features.list.search')}
              </span>
              <span className='px-10 col-12 row items-center x-gap-10'>
                <Icon
                  icon='octicon:dot-fill-24'
                  className='col-2 text-brand  pl-20'
                />
                <span className='text-sm text-brand col-10'>
                  {item?.roles?.search_position === '10' &&
                    t('features.position.first')}
                  {item?.roles?.search_position === '20' &&
                    t('features.position.second')}
                  {item?.roles?.search_position === '30' &&
                    t('features.position.third')}
                  {item?.roles?.search_position === '40' &&
                    t('features.position.last')}
                </span>
              </span>
            </li>
          )}{' '}
          {item?.roles?.featured && (
            <li>
              <Icon icon='openmoji:check-mark' className='icon' />
              {t('features.list.featured')}
            </li>
          )}{' '}
          {item?.roles?.visibility_radius && (
            <li>
              <Icon icon='openmoji:check-mark' className='icon' />
              {t('features.list.visibility')}
              <sup>
                <b>{item?.roles?.visibility_radius} km</b>
              </sup>
            </li>
          )}{' '}
        </ul>
        {item?.isRecommend && (
          <div className='recommended'>{t('features.recommended')}</div>
        )}
      </div>

      <UpgradePlanButton
        title={title}
        // currentSubscriptionId={
        //   dwelling?.subscription?.isFree
        //     ? null
        //     : subscription?.stripe_subscription_id
        // }
        // newPlanId={item?.stripe_price_id}
        // oldStrapiSubscriptionId={
        //   dwelling?.subscription?.isFree || item?.isFree
        //     ? dwelling?.subscription?.id
        //     : null
        // }
        // subscription={subscription}
        // isFree={item?.isFree}
        // customerId={subscription?.stripe_customer_id}

        subscription={item}
        dwelling={dwelling}
        state={state}
        onSuccess={onSuccess}
      />
    </div>
  )
}

export default SubscriptionUpgradeCard
