import useFetch from '@/hooks/useFetch'
import { Icon } from '@iconify/react'
import PackageSelectCard from './card/PackageSelectCard'

const PackageSelector = ({ value, onChange }) => {
  const { data, error, isLoading } = useFetch({
    url: '/api/packages',
    keys: ['plans', open],
    query: {
      sort: ['order:asc'],
    },
  })

  return (
    <div className=''>
      <div className='row x-gap-10'>
        {isLoading ? (
          <div>
            <Icon icon='line-md:loading-twotone-loop' />
          </div>
        ) : data?.length > 0 && !isLoading ? (
          data?.map(plan => (
            <div key={plan.id} className='col-sm-12 col-md-6 col-lg-3'>
              <PackageSelectCard
                item={plan}
                value={value}
                onChange={onChange}
                className='col-auto'
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

export default PackageSelector
