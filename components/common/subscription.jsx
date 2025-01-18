'use client'

import useFetch from '@/hooks/useFetch'
import SubscriptionCard from './card/subscription-card'
import Modal from './Modal'

const SubscriptionPlans = ({
  packageId,
  dwellingId,
  title = '',
  isForm = false,
}) => {
  const { data, error, isLoading } = useFetch({
    url: '/api/packages',
    keys: ['plans', open],
    query: {
      filters: {
        id: {
          $eq: packageId || null,
        },
      },
      sort: ['order:asc'],
    },
  })

  return (
    <div className='mb-30'>
      <h5 className='my-3'>{title}</h5>
      <div className='row x-gap-5 y-gap-5 justify-center items-center'>
        {isLoading ? (
          <div>Loading</div>
        ) : data?.length > 0 && !isLoading ? (
          data?.map((plan, idx) => (
            <div key={idx} className={'col-sm-12 col-md-3'}>
              <SubscriptionCard
                isForm={isForm}
                key={plan.id}
                item={plan}
                dwellingId={dwellingId}
              />
            </div>
          ))
        ) : (
          <div>No plans available</div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionPlans
