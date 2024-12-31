import { NextResponse } from 'next/server'
import { twilioClient } from '@/lib/twilio'

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json()

    const phoneNumberLookup = await twilioClient.lookups.v2.phoneNumbers(phoneNumber).fetch()

    if (phoneNumberLookup.valid) {
      return NextResponse.json({ valid: true })
    } else {
      return NextResponse.json({ valid: false }, { status: 400 })
    }
  } catch (error) {
    console.error('Error validating phone number:', error)
    return NextResponse.json({ error: 'Failed to validate phone number' }, { status: 500 })
  }
}