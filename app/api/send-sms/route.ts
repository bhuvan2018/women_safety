import { NextResponse } from 'next/server'

const apiKey = process.env.TWOFACTOR_API_KEY

if (!apiKey) {
  throw new Error('2Factor API key is not properly configured')
}

export async function POST(request: Request) {
  try {
    const { to, body } = await request.json()

    if (!to || !body) {
      return NextResponse.json({ success: false, message: 'Missing required parameters' }, { status: 400 })
    }

    const encodedBody = encodeURIComponent(body)
    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${to}/${encodedBody}`

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json()
      if (data.Status === 'Success') {
        console.log('SMS sent successfully')
        return NextResponse.json({ success: true, message: 'SMS sent successfully' })
      } else {
        throw new Error(data.Details || 'Failed to send SMS')
      }
    } else {
      // If the response is not JSON, read it as text
      const text = await response.text()
      throw new Error(`Unexpected response from 2Factor API: ${text.substring(0, 100)}...`)
    }
  } catch (error) {
    console.error('Error sending SMS:', error instanceof Error ? error.message : JSON.stringify(error))
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send SMS'
    }, { status: 500 })
  }
}

