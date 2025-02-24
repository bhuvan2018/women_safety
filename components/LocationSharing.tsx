"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import emailjs from "@emailjs/browser"

export default function LocationSharing() {
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  const shareLocation = async () => {
    setIsSharing(true)

    try {
      // Puttur coordinates
      const putturLocation = {
        latitude: 12.7606,
        longitude: 75.2006,
      }

      const googleMapsUrl = `https://www.google.com/maps?q=${putturLocation.latitude},${putturLocation.longitude}`

      // Send email using emailJS
      const result = await emailjs.send(
        "service_o17yyqp",
        "template_0f6e8pl",
        {
          from_name: "SafeWalk Location Sharing",
          from_email: "location@safewalk.com",
          subject: "Live Location Shared via SafeWalk",
          message: `A user has shared their location with you.\n\nLocation: Puttur, Karnataka\nView on Google Maps: ${googleMapsUrl}\n\nThis is an automated message from SafeWalk's Location Sharing feature.`,
          to_email: "bhuvanshetty2018@gmail.com",
        },
        "x2oCH1LfVilF8i5ij",
      )

      if (result.text === "OK") {
        toast({
          title: "Location Shared Successfully",
          description: "Your live location has been shared via email.",
        })
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      console.error("Error sharing location:", error)
      toast({
        title: "Error",
        description: "Failed to share location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Emergency Location Sharing</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-4">Quickly share your location with emergency contacts in case of danger.</p>
        <Button onClick={shareLocation} disabled={isSharing} className="w-full bg-orange-500 hover:bg-orange-600">
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

