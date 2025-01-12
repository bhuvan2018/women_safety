'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import emailjs from '@emailjs/browser'

export default function SOS() {
const [isActive, setIsActive] = useState(false)
const router = useRouter()
const { toast } = useToast()

const handleSOS = async () => {
  setIsActive(true)
  
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200])
  }

  try {
    const result = await emailjs.send(
      'service_o17yyqp',
      'template_0f6e8pl', // Corrected template ID
      {
        from_name: 'SafeWalk SOS Alert',
        from_email: 'sos@safewalk.com',
        subject: 'URGENT: SOS Alert from SafeWalk User',
        message: 'A SafeWalk user has triggered an SOS alert. Immediate assistance may be required.',
      },
      'x2oCH1LfVilF8i5ij'
    )

    console.log('Email sent:', result.text)
    toast({
      title: "SOS Alert Activated",
      description: "Emergency alert has been sent. Help is on the way.",
      variant: "destructive",
    })
    router.push('/emergency-alert')
  } catch (error) {
    console.error('Error sending SOS alert:', error)
    toast({
      title: "SOS Alert Failed",
      description: "Failed to send SOS alert. Please try again or contact emergency services directly.",
      variant: "destructive",
    })
  } finally {
    setIsActive(false)
  }
}

return (
  <>
    <motion.button
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-full text-white font-bold text-sm shadow-lg flex items-center justify-center ${
        isActive ? 'bg-red-600' : 'bg-orange-500'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isActive ? { 
        scale: [1, 1.2, 1],
        boxShadow: ['0px 0px 0px rgba(255,0,0,0)', '0px 0px 20px rgba(255,0,0,0.7)', '0px 0px 0px rgba(255,0,0,0)']
      } : {}}
      transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatType: "reverse" }}
      onClick={handleSOS}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
    </motion.button>
  </>
)
}