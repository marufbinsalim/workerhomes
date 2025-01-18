import Wrapper from '@/components/layout/Wrapper'
import dynamic from 'next/dynamic'

const SingleHotelPage = () => {
  return <Wrapper>SingleHotelPage</Wrapper>
}

export default dynamic(() => Promise.resolve(SingleHotelPage), { ssr: false })
