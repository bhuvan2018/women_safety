'use server'

import { cookies } from 'next/headers'

// This should be replaced with a proper database in a real application
const mockDatabase: { [key: string]: { otp: string, verified: boolean, attempts: number } } = {}

async function sendSMS(to: string, body: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-sms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, body }),
  })

  const result = await response.json()
  return result.success
}

export async function sendOTP(mobileNumber: string) {
  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Send the OTP via SMS
  const smsSent = await sendSMS(mobileNumber, `Your SafeWalk OTP is: ${otp}`)
  
  if (smsSent) {
    // Store the OTP in our mock database
    mockDatabase[mobileNumber] = { otp, verified: false, attempts: 0 }
    return { success: true, message: 'OTP sent successfully' }
  } else {
    return { success: false, message: 'Failed to send OTP. Please try again.' }
  }
}

export async function verifyOTP(mobileNumber: string, otp: string) {
  const storedData = mockDatabase[mobileNumber]
  
  if (!storedData) {
    return { success: false, message: 'No OTP was sent to this number' }
  }
  
  storedData.attempts += 1

  if (storedData.attempts > 3) {
    delete mockDatabase[mobileNumber]
    return { success: false, message: 'Too many attempts. Please request a new OTP.' }
  }

  if (storedData.otp === otp) {
    storedData.verified = true
    
    // Generate a session token (in a real app, use a proper session management system)
    const sessionToken = `session_${Math.random().toString(36).substr(2, 9)}`
    cookies().set('session', sessionToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 1 week
    })
    
    delete mockDatabase[mobileNumber] // Clear OTP after successful verification
    return { success: true, message: 'OTP verified successfully' }
  } else {
    return { success: false, message: 'Invalid OTP' }
  }
}

export async function logout() {
  cookies().delete('session')
  return { success: true, message: 'Logged out successfully' }
}

