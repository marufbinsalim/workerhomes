import { reCaptcha } from '@/config'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
  try {
    const { token } = await req.json()

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${reCaptcha.secretKey}&response=${token}`

    const response = await fetch(verificationUrl, {
      method: 'POST',
    })

    const data = await response.json()

    if (data?.success && data?.score > 0.5) {
      return NextResponse.json(
        { success: true, score: data?.score },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { success: false, score: data?.score, error: data['error-codes'] },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
