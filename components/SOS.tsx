"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle } from "lucide-react"
import emailjs from "@emailjs/browser"

const saveSOSAlert = (location: { name: string; latitude: number; longitude: number }) => {
  const sosAlert = {
    id: Date.now(),
    type: "SOS Alert",
    content: `SOS Alert triggered at ${location.name} (${location.latitude}, ${location.longitude})`,
    created_at: new Date().toISOString(),
    user: {
      name: "User", // In a real app, you'd get this from the authenticated user
      email: "user@example.com", // In a real app, you'd get this from the authenticated user
    },
  }

  const storedAlerts = localStorage.getItem("sosAlerts")
  const alerts = storedAlerts ? JSON.parse(storedAlerts) : []
  alerts.unshift(sosAlert)
  localStorage.setItem("sosAlerts", JSON.stringify(alerts))
}

export default function SOS() {
  const [isActive, setIsActive] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (isActive && countdown === 0) {
      router.push("/emergency-alert")
    }
    return () => clearTimeout(timer)
  }, [isActive, countdown, router])

  const handleSOS = async () => {
    setIsActive(true)

    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200])
    }

    try {
      const location = {
        name: "Vivekananda College, Puttur",
        latitude: 12.7606,
        longitude: 75.2006,
      }

      const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`

      const result = await emailjs.send(
        "service_o17yyqp",
        "template_0f6e8pl",
        {
          from_name: "SafeWalk SOS Alert",
          from_email: "sos@safewalk.com",
          subject: "URGENT: SOS Alert from SafeWalk User",
          message: `A SafeWalk user has triggered an SOS alert. Immediate assistance may be required.

Location: ${location.name}
Map Link: ${googleMapsUrl}`,
        },
        "x2oCH1LfVilF8i5ij",
      )

      saveSOSAlert(location)

      console.log("Email sent:", result.text)
      toast({
        title: "SOS Alert Activated",
        description: "Emergency alert and location have been sent. Help is on the way.",
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error sending SOS alert:", error)
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
        onClick={handleSOS}
        className="w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AlertTriangle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-600 flex items-center justify-center z-50"
          >
            <div className="text-center text-white p-8">
              <h1 className="text-4xl font-bold mb-6">SOS Alert Activated</h1>
              <p className="text-2xl mb-6">Help is on the way. Stay calm and remain in a safe location if possible.</p>
              <p className="text-xl mb-6">Your location has been sent to emergency services.</p>
              <p className="text-xl">Redirecting to emergency instructions in {countdown} seconds...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

