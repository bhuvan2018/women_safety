'use server'

import { sendEmail } from '@/lib/email'

export async function sendEmergencyAlert(contactEmail: string, location: string) {
  const subject = 'EMERGENCY ALERT'
  const message = `EMERGENCY ALERT: Violence detected. Location: ${location}`
  
  try {
    const result = await sendEmail(contactEmail, subject, message)
    if (result.success) {
      return { success: true, message: 'Emergency alert sent successfully' }
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('Error sending emergency alert:', error)
    return { success: false, message: error instanceof Error ? error.message : 'Failed to send emergency alert' }
  }
}

