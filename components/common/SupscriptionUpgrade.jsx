import useFetch from '@/hooks/useFetch'
import SubscriptionCard from './card/subscription-card'
import Modal from './Modal'
import { Icon } from '@iconify/react'
import SubscriptionUpgradeCard from './card/subscription-upgrade-card'

const SubscriptionUpgrade = ({ item, state = 'upgrade', onSuccess }) => {
  const subscription = item?.subscription

  let filter = null

  switch (state) {
    case 'upgrade':
      filter = {
        $gt: subscription?.package?.price,
      }
      break
    case 'downgrade':
      filter = {
        $lt: subscription?.pending_subscription?.id
          ? subscription?.pending_subscription?.package?.price
          : subscription?.package?.price,
      }
      break
  }

  const { data, error, isLoading } = useFetch({
    url: '/api/packages',
    keys: ['plans', open],
    query: {
      sort: ['order:asc'],
      filters: {
        $and: [
          {
            price: filter,
          },
          {
            id: {
              $ne: subscription?.package?.id,
            },
          },
        ],
        // isFree: {
        //   $eq: false,
        // },
      },
    },
  })

  return (
    <div className='relative'>
      <div className='subscription-container-2'>
        {isLoading ? (
          <div>
            <Icon icon='line-md:loading-twotone-loop' />
          </div>
        ) : data?.length > 0 && !isLoading ? (
          data?.map(plan => (
            <SubscriptionUpgradeCard
              subscription={subscription}
              dwelling={item}
              key={plan.id}
              item={plan}
              className='col-auto'
              state={state}
              onSuccess={onSuccess}
            />
          ))
        ) : (
          <div>No plans available</div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionUpgrade
