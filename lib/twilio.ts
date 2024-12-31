import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioNumber = process.env.TWILIO_PHONE_NUMBER

if (!accountSid || !authToken || !twilioNumber) {
  throw new Error('Missing Twilio configuration')
}

export const twilioClient = twilio(accountSid, authToken)
export const fromNumber = twilioNumber