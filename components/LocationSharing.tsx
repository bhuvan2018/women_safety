'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function LocationSharing() {
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  const shareLocation = () => {
    if (navigator.geolocation) {
      setIsSharing(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
          
          // In a real app, you would send this to your emergency contacts
          console.log('Location shared:', googleMapsUrl)
          
          toast({
            title: "Location Shared",
            description: "Your live location has been logged. In a real scenario, this would be shared with your emergency contacts.",
          })
          setIsSharing(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          toast({
            title: "Error",
            description: "Could not access location. Please enable location services.",
            variant: "destructive",
          })
          setIsSharing(false)
        }
      )
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Emergency Location Sharing</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-4">
          Quickly share your location with emergency contacts in case of danger.
        </p>
        <Button 
          onClick={shareLocation} 
          disabled={isSharing}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {isSharing ? (
            "Sharing Location..."
          ) : (
            <>
              <Share className="mr-2 h-4 w-4" />
              Share Location Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

