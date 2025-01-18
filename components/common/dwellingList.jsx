'use client'

import Slider from 'react-slick'
import DwellingCard from './card/dwelling-card'

const DwellingList = ({ data }) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: data?.length > 4 ? 4 : data?.length,
    // slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <>
      <Slider {...settings}>
        {data?.length > 0 &&
          data?.map(item => (
            <div
              className='col-xl-3 col-lg-3 col-sm-6'
              key={item?.id}
              data-aos='fade'
              data-aos-delay={item.delayAnimation}
            >
              <DwellingCard item={item} />
            </div>
          ))}
      </Slider>
    </>
  )
}

export default DwellingList
