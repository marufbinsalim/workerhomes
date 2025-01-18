import { exactPath } from '@/utils'
import Image from 'next/image'

const PopularFacilities = ({ data }) => {
  return (
    <>
      {data?.length > 0 &&
        data?.map((item, index) => (
          <div className='col-md-5' key={index}>
            <div className='d-flex x-gap-15 y-gap-15 items-center'>
              <Image
                src={exactPath(item?.icon?.url)}
                alt={item?.title}
                width={40}
                height={40}
              />
              <div className='text-15'>{item?.title}</div>
            </div>
          </div>
        ))}
    </>
  )
}

export default PopularFacilities
