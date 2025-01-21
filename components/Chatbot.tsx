"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Send, MapPin, AlertTriangle, ThumbsUp, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface Message {
  type: "user" | "bot"
  content: string
}

interface Feature {
  icon: React.ElementType
  text: string
  color: string
  response: string
}

const features: Feature[] = [
  {
    icon: AlertTriangle,
    text: "Emergency Assistance",
    color: "bg-red-500",
    response:
      "For immediate emergency assistance, please use the SOS button. It will alert your emergency contacts and local authorities if needed.",
  },
  {
    icon: MessageSquare,
    text: "Incident Reporting",
    color: "bg-blue-500",
    response:
      "To report an incident, go to the Community section and use the Incident Reporting feature. Your report will help keep others informed and safe.",
  },
  {
    icon: MapPin,
    text: "Location Guidance",
    color: "bg-green-500",
    response:
      "Our Safety Zones feature provides information about safe areas near you. You can also see safety ratings for different locations to help guide your movements.",
  },
  {
    icon: ThumbsUp,
    text: "Safety Tips",
    color: "bg-yellow-500",
    response:
      "Here are some quick safety tips: Stay aware of your surroundings, trust your instincts, keep your phone charged, and share your location with trusted contacts when traveling.",
  },
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setMessages([{ type: "bot", content: "Hello! I'm the SafeWalk Assistant. How can I help you today?" }])
      toast({
        title: "SafeWalk Assistant",
        description: "Your helper is ready to assist you.",
        duration: 3000,
      })
    }
  }, [isOpen, toast])

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: input },
        {
          type: "bot",
          content:
            "I'm sorry, I don't have a specific answer for that. Please try asking about one of our main features or use the buttons below for quick information.",
        },
      ])
      setInput("")
    }
  }

  const handleFeatureClick = (feature: Feature) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", content: `Tell me about ${feature.text}` },
      { type: "bot", content: feature.response },
    ])
  }

  return (
    <>
      <motion.button
        className="w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <Bot className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-gray-900 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold">SafeWalk Assistant</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-64 p-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`mb-2 ${message.type === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      message.type === "user" ? "bg-orange-500" : "bg-gray-700"
                    } text-white`}
                  >
                    {message.content}
                  </span>
                </motion.div>
              ))}
              {messages.length === 1 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {features.map((feature, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`h-auto py-4 px-2 flex flex-col items-center text-center rounded-lg ${feature.color} text-white`}
                      onClick={() => handleFeatureClick(feature)}
                    >
                      <feature.icon className="mb-2" />
                      <span className="text-xs">{feature.text}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center">
                <Input
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-grow mr-2 bg-gray-800 text-white border-gray-700"
                />
                <Button onClick={handleSend} className="bg-orange-500 hover:bg-orange-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

