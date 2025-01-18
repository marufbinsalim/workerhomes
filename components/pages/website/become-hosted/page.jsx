'use client'

import DwellingCard from '@/components/common/card/dwelling-card'
import Input from '@/components/common/Input'
import { useBookmarks } from '@/context/BookmarkProvider'
import { getCurrency, getExchange } from '@/lib/services/currency'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const BecomeHostedPage = () => {
  const t = useTranslations('become-hosted')

  const [guests, setGuests] = useState(0)
  const [price, setPrice] = useState(0)
  const [nights, setNights] = useState(30)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)

  const locale = useParams().locale
  const currency = getCurrency(locale)

  const handleCalculate = async () => {
    setIsLoading(true)

    try {
      const totalPrice = guests * price * nights
      const result = await getExchange('PLN', currency.key, totalPrice)
      setResult(result.convertedAmount)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (guests > 0 && price > 0) {
        handleCalculate()
      }
    }, 500) // 500ms debounce delay

    return () => {
      clearTimeout(debounceTimeout)
    }
  }, [guests, price, nights])

  return (
    <>
      <div className='header-margin' />
      {/* header top margin */}
      <section className='layout-pt-xl layout-pb-xl'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-auto'>
              <div className='sectionTitle -md'>
                <h2 className='sectionTitle__title'>{t('title')}</h2>
                <p className=' sectionTitle__text mt-5 sm:mt-0'>
                  {t('description')}
                </p>
              </div>
            </div>
          </div>

          <div className='row justify-center mt-10 x-gap-10 y-gap-10'>
            <div className='col-12 col-md-6'>
              <div className='form-input '>
                <input
                  type='number'
                  name='guests'
                  autoFocus
                  onChange={e => setGuests(e.target.value)}
                  value={guests}
                  required
                />
                <label className='lh-1 text-14 text-light-1'>
                  {t('form.fields.guests')}
                </label>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='form-input '>
                <input
                  type='number'
                  name='price'
                  autoFocus
                  onChange={e => setPrice(e.target.value)}
                  value={price}
                  required
                />
                <label className='lh-1 text-14 text-light-1'>
                  {t('form.fields.price')}
                </label>
              </div>
            </div>
          </div>

          <div className='row justify-center items-center'>
            {result && !isLoading ? (
              <div className='mt-40 col-auto'>
                <div className='result-card  border pt-20 pr-40 pl-40 pb-20 text-center rounded '>
                  <h1>{t('form.result.title')}</h1>
                  <h2>
                    {currency.symbol} {result}
                  </h2>
                  <p>
                    <span className='underline fw-700'>
                      {nights + ' '}
                      {t('form.result.nights')}
                    </span>{' '}
                    {t('form.result.estimated')} {currency.symbol} {result}
                  </p>
                  <input
                    type='range'
                    className='form-range mt-10'
                    id='customRange1'
                    value={nights}
                    min={1}
                    max={30}
                    onChange={e => setNights(e.target.value)}
                  />
                </div>
              </div>
            ) : !result && !isLoading ? null : (
              <div className='col-auto text-center'>...</div>
            )}
          </div>
        </div>
      </section>
      {/* End title */}
    </>
  )
}

export default BecomeHostedPage

// 'use client'

// import DwellingCard from '@/components/common/card/dwelling-card'
// import Input from '@/components/common/Input'
// import { useBookmarks } from '@/context/BookmarkProvider'
// import { getCurrency, getExchange } from '@/lib/services/currency'
// import { Icon } from '@iconify/react'
// import { useTranslations } from 'next-intl'
// import { useParams } from 'next/navigation'
// import { useState } from 'react'

// const BecomeHostedPage = () => {
//   const t = useTranslations('become-hosted')

//   const [guests, setGuests] = useState(1)
//   const [price, setPrice] = useState(0)
//   const [nights, setNights] = useState(30)
//   const [isLoading, setIsLoading] = useState(false)
//   const [result, setResult] = useState(null)

//   const locale = useParams().locale
//   const currency = getCurrency(locale)

//   const handleCalculate = async () => {
//     setIsLoading(true)

//     try {
//       const totalPrice = guests * price * nights

//       const result = await getExchange('PLN', currency.key, totalPrice)
//       setResult(result.convertedAmount)
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <>
//       <div className='header-margin' />
//       {/* header top margin */}
//       <section className='layout-pt-xl layout-pb-xl'>
//         <div className='container'>
//           <div className='row justify-center text-center'>
//             <div className='col-auto'>
//               <div className='sectionTitle -md'>
//                 <h2 className='sectionTitle__title'>{t('title')}</h2>
//                 <p className=' sectionTitle__text mt-5 sm:mt-0'>
//                   {t('description')}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className='row justify-center mt-10 x-gap-10 y-gap-10'>
//             <div className='col-12 col-md-6'>
//               <div className='form-input '>
//                 <input
//                   type='number'
//                   name='quests'
//                   autoFocus
//                   onChange={e => setGuests(e.target.value)}
//                   value={guests}
//                   required
//                 />
//                 <label className='lh-1 text-14 text-light-1'>
//                   {t('form.fields.guests')}
//                 </label>
//               </div>
//             </div>
//             <div className='col-12 col-md-6'>
//               <div className='form-input '>
//                 <input
//                   type='number'
//                   name='price'
//                   autoFocus
//                   onChange={e => setPrice(e.target.value)}
//                   value={price}
//                   required
//                 />
//                 <label className='lh-1 text-14 text-light-1'>
//                   {t('form.fields.price')}
//                 </label>
//               </div>
//             </div>

//             <div className='col-12'>
//               <button
//                 type='button'
//                 onClick={handleCalculate}
//                 disabled={!guests || !price || isLoading}
//                 className='button py-20  -dark-1 bg-blue-1 text-white w-100'
//               >
//                 {t('form.button')}{' '}
//                 <Icon
//                   icon={
//                     isLoading
//                       ? 'line-md:loading-loop'
//                       : 'solar:login-3-line-duotone'
//                   }
//                   className='ml-10'
//                   width={20}
//                   height={20}
//                 />
//               </button>
//             </div>
//           </div>

//           <div className='row justify-center items-center'>
//             {result && !isLoading ? (
//               <div className='mt-40 col-auto'>
//                 <div className='result-card  border pt-20 pr-40 pl-40 pb-20 text-center rounded '>
//                   <h1>{t('form.result.title')}</h1>
//                   <h2>
//                     {currency.symbol} {result}
//                   </h2>
//                   <p>
//                     <span className='underline fw-700'>
//                       {nights + ' '}
//                       {t('form.result.nights')}
//                     </span>{' '}
//                     {t('form.result.estimated')} {currency.symbol} {result}
//                   </p>
//                   <input
//                     type='range'
//                     class='form-range mt-10'
//                     id='customRange1'
//                     value={nights}
//                     min={1}
//                     max={30}
//                     onChange={e => setNights(e.target.value)}
//                     onMouseLeave={e => {
//                       handleCalculate()
//                     }}
//                   />
//                 </div>
//               </div>
//             ) : !result && !isLoading ? null : (
//               <div className='col-auto text-center'>...</div>
//             )}
//           </div>
//         </div>
//       </section>
//       {/* End title */}
//     </>
//   )
// }

// export default BecomeHostedPage
