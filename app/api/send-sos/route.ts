import { NextResponse } from 'next/server'
import { twilioClient, fromNumber } from '@/lib/twilio'

export async function POST(req: Request) {
  try {
    const { contacts } = await req.json()

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ error: 'No emergency contacts found' }, { status: 400 })
    }

    const message = "I'm in danger. Please help!"

    for (const contact of contacts) {
      await twilioClient.messages.create({
        body: message,
        from: fromNumber,
        to: contact.phoneNumber
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending SOS messages:', error)
    return NextResponse.json({ error: 'Failed to send SOS messages' }, { status: 500 })
  }
}