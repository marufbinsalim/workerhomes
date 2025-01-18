'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Success = () => {
  const router = useRouter()
  const { session_id } = router.query
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState < any > null

  useEffect(() => {
    if (session_id) {
      resetCart()

      fetch(`/api/checkout/${session_id}`)
        .then(res => res.json())
        .then(data => {
          setSession(data)
          setLoading(false)
        })
    }
  }, [session_id])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
      <h1 className='text-4xl font-bold text-green-600'>Payment Successful</h1>
      {loading ? (
        <p className='text-gray-600 mt-4'>Loading session details...</p>
      ) : session ? (
        <div className='mt-4 text-center'>
          <p className='text-lg text-gray-800'>Thank you for your purchase!</p>
          <p className='text-gray-600'>Order ID: {session.id}</p>
          <p className='text-gray-600'>Amount: $100</p>
        </div>
      ) : (
        <p className='text-red-600 mt-4'>Session not found.</p>
      )}
      <Link href='/'>
        <a className='mt-6 text-blue-500 hover:underline'>Go back to Home</a>
      </Link>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Success), { ssr: false })
