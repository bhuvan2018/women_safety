'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function SOS() {
  const [isActive, setIsActive] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [hasEmergencyContacts, setHasEmergencyContacts] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkEmergencyContacts = () => {
      const contacts = localStorage.getItem('emergencyContacts')
      if (contacts) {
        const parsedContacts = JSON.parse(contacts)
        setHasEmergencyContacts(parsedContacts.length > 0)
        setEmergencyContacts(parsedContacts)
      } else {
        setHasEmergencyContacts(false)
        setEmergencyContacts([])
      }
    }

    checkEmergencyContacts()
    window.addEventListener('storage', checkEmergencyContacts)

    return () => {
      window.removeEventListener('storage', checkEmergencyContacts)
    }
  }, [])

  const handleSOS = async () => {
    if (!hasEmergencyContacts) {
      setShowAlert(true)
      return
    }

    setIsActive(true)
    
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200])
    }

    try {
      const response = await fetch('/api/send-sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts: emergencyContacts }),
      })

      if (response.ok) {
        toast({
          title: "SOS Alert Activated",
          description: "Emergency services and contacts have been notified.",
          variant: "destructive",
        })
        router.push('/emergency-alert')
      } else {
        throw new Error('Failed to send SOS alert')
      }
    } catch (error) {
      console.error('Error sending SOS alert:', error)
      toast({
        title: "SOS Alert Failed",
        description: "Failed to send SOS alert. Please try again or contact emergency services directly.",
        variant: "destructive",
      })
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

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Emergency Contacts</AlertDialogTitle>
            <AlertDialogDescription>
              You haven't added any emergency contacts yet. Would you like to add them now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => router.push('/emergency-contacts')}>
                Add Contacts
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}