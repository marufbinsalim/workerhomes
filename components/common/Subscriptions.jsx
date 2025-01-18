import subscriptions from '@/config/subscriptions'

const Plans = () => {
  return (
    <div className='plans-container'>
      {subscriptions?.map(plan => (
        <div
          key={plan.id}
          className={`plan ${plan.isRecommended ? 'recommended ' : ''}`}
        >
          <h2>{plan.title}</h2>
          <p className='price'>
            ${plan.price}
            {plan.duration && <span>/{plan.duration}</span>}
          </p>
          <ul>
            {plan.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default Plans
