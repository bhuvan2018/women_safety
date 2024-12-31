'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Emergency Contacts</h1>
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
                <li key={index} className="flex justify-between items-center bg-gray-800 p-4 rounded">
                  <div>
                    <p className="font-medium text-white">{contact.name}</p>
                    <p className="text-gray-400">{contact.phoneNumber}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}