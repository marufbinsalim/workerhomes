import { exactPath } from '@/utils'
import Image from 'next/image'
import DropdownMenu from '../DropdownMenu'
import { Icon } from '@iconify/react'

const GalleryCard = ({ item, options }) => {
  return (
    <div
      className={
        item?.order === 1 ? 'gallery-card main-border' : 'gallery-card'
      }
    >
      <div className='gallery-card-image-wrap'>
        {item?.image?.url && (
          <Image
            src={exactPath(item?.image?.url)}
            alt='Gallery item'
            fill
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>
      <div className='gallery-card-buttons'>
        <DropdownMenu options={options} side='right' />
        {item?.order === 1 && (
          <Icon icon='solar:star-bold' className='mx-3 mt-2 main-icon' />
        )}
      </div>
    </div>
  )
}

export default GalleryCard
