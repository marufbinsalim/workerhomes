import Wrapper from '@/components/layout/Wrapper'
import PricingPage from '@/components/pages/website/pricing'
import { exactPath } from '@/utils'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

export const metadata = {
  title: 'Pricing | Homeworkers - Find Your Perfect Home for Rent',
  description:
    'Find your perfect home for blog with a variety of options to suit your needs.',
  keywords:
    'home rental, houses for rent, apartments for rent, rental properties',
  openGraph: {
    title: 'Workerhomes',
    description:
      'Find your perfect home for rent with a variety of options to suit your needs.',
    url: 'https://workerhomes.pl',
    type: 'website',
    images: [
      {
        url: exactPath('/uploads/logo_dark_48857cce96.png'),
        width: 800,
        height: 600,
        alt: ' Home Rentals - Find Your Perfect Home for Rent',
      },
    ],
  },
}

export default dynamic(
  () =>
    Promise.resolve(({ locale }) => (
      <>
        <Wrapper defaultFooter>
          <PricingPage locale={locale} />
        </Wrapper>
      </>
    )),
  {
    ssr: false,
  }
)
