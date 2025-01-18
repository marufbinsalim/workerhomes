import useFetch from '@/hooks/useFetch'
import SubscriptionCard from './card/subscription-card'
import Modal from './Modal'
import { Icon } from '@iconify/react'

const SubscriptionOptions = ({ open, setOpen }) => {
  const { data, error, isLoading } = useFetch({
    url: '/api/packages',
    keys: ['plans', open],
    query: {
      sort: ['order:asc'],
      filters: {
        isFree: {
          $eq: false,
        },
      },
    },
  })

  return (
    <Modal open={open} setOpen={setOpen} title='Buy a plan' size='lg'>
      <div className='subscription-container'>
        {isLoading ? (
          <div>
            <Icon icon='line-md:loading-twotone-loop' />
          </div>
        ) : data?.length > 0 && !isLoading ? (
          data?.map(plan => (
            <SubscriptionCard key={plan.id} item={plan} className='col-auto' />
          ))
        ) : (
          <div>No plans available</div>
        )}
      </div>
    </Modal>
  )
}

export default SubscriptionOptions
