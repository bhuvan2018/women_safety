'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Contact {
  name: string
  phoneNumber: string
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts')
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    }
  }, [])

  const addContact = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/validate-phone-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: newPhoneNumber }),
      })

      if (!response.ok) {
        throw new Error('Invalid phone number')
      }

      const newContacts = [...contacts, { name: newName, phoneNumber: newPhoneNumber }]
      setContacts(newContacts)
      localStorage.setItem('emergencyContacts', JSON.stringify(newContacts))
      setNewName('')
      setNewPhoneNumber('')
      toast({
        title: "Contact Added",
        description: "Emergency contact has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add contact. Please ensure the phone number is valid.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section with Background Image */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Opinion%20_%20Where%20Can%20Domestic%20Violence%20Victims%20Turn%20During%20Covid-19_%20(Published%202020)-VXwIS2XN8gnn9bIAOnQWgUL55hB0nk.jpeg"
            alt="Emergency Contact Background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950"></div>
        </div>
        <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center px-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white text-center mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Emergency Contacts
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-300 text-center max-w-2xl"
          >
            Add and manage your emergency contacts. These contacts will be notified immediately in case of an emergency.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto p-4 -mt-20 relative z-20">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Add New Contact</h2>
            <form onSubmit={addContact} className="space-y-4">
              <Input
                type="text"
                placeholder="Contact Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-gray-800 text-white border-gray-700"
                required
              />
              <Input
                type="tel"
                placeholder="Contact Phone Number"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                className="w-full bg-gray-800 text-white border-gray-700"
                required
              />
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Add Contact
              </Button>
            </form>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Saved Contacts</h2>
            {contacts.length === 0 ? (
              <p className="text-gray-400">No emergency contacts added yet.</p>
            ) : (
              <ul className="space-y-4">
                {contacts.map((contact, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center bg-gray-800 p-4 rounded"
                  >
                    <div>
                      <p className="font-medium text-white">{contact.name}</p>
                      <p className="text-gray-400">{contact.phoneNumber}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}