const env = process.env

module.exports = [
  {
    id: 1,
    stripePriceId: '',
    title: 'Basic',
    price: 0,
    features: [
      'Unlimited access to all the content',
      'Limited access to the community',
      'Limited access to the events',
    ],
  },
  {
    id: 2,
    stripePriceId: env.NEXT_PUBLIC_STRIPE_PLATINUM_PRICE_ID || '',
    title: 'Platinum',
    duration: 'month',
    price: 50,
    features: [
      'Unlimited access to all the content',
      'Unlimited access to the community',
      'Limited access to the events',
    ],
  },
  {
    id: 3,
    stripePriceId: env.NEXT_PUBLIC_STRIPE_SILVER_PRICE_ID || '',
    title: 'Silver',
    price: 199,
    duration: 'month',
    features: [
      'Unlimited access to all the content',
      'Unlimited access to the community',
      'Unlimited access to the events',
    ],
    isRecommended: true,
  },
  {
    id: 4,
    stripePriceId: env.NEXT_PUBLIC_STRIPE_GOLD_PRICE_ID || '',
    title: 'Gold',
    price: 100,
    duration: 'month',
    features: [
      'Unlimited access to all the content',
      'Unlimited access to the community',
      'Unlimited access to the events',
      'Priority support',
    ],
  },
]
