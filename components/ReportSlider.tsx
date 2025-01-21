"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReportSliderProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

interface Report {
  id: number
  name: string
  email: string
  contact: string
  type: string
  content: string
  created_at: string
}

export default function ReportSlider({ isOpen, onClose, onSubmit }: ReportSliderProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [contact, setContact] = useState("")
  const [complaint, setComplaint] = useState("")
  const [helpRequest, setHelpRequest] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const content = step === 3 ? complaint : helpRequest
    const type = step === 3 ? "complaint" : "help"

    const newReport: Report = {
      id: Date.now(),
      name,
      email,
      contact,
      type,
      content,
      created_at: new Date().toISOString(),
    }

    const storedReports = localStorage.getItem("navbarReports")
    const reports = storedReports ? JSON.parse(storedReports) : []
    const updatedReports = [newReport, ...reports]
    localStorage.setItem("navbarReports", JSON.stringify(updatedReports))

    toast({
      title: "Report Submitted",
      description: "Your message has been saved successfully.",
    })
    setName("")
    setEmail("")
    setContact("")
    setComplaint("")
    setHelpRequest("")
    setStep(0)
    onSubmit()
    onClose()
  }

  const validateStep = () => {
    switch (step) {
      case 0:
        if (!name.trim()) {
          toast({
            title: "Name Required",
            description: "Please enter your name before proceeding.",
            variant: "destructive",
          })
          return false
        }
        break
      case 1:
        if (!email.trim() || !email.includes("@")) {
          toast({
            title: "Valid Email Required",
            description: "Please enter a valid email address before proceeding.",
            variant: "destructive",
          })
          return false
        }
        break
      case 2:
        if (!contact.trim()) {
          toast({
            title: "Contact Number Required",
            description: "Please enter your contact number before proceeding.",
            variant: "destructive",
          })
          return false
        }
        break
      case 3:
        if (!complaint.trim()) {
          toast({
            title: "Complaint Details Required",
            description: "Please describe your complaint before submitting.",
            variant: "destructive",
          })
          return false
        }
        break
      case 4:
        if (!helpRequest.trim()) {
          toast({
            title: "Help Request Details Required",
            description: "Please describe what kind of help you need before submitting.",
            variant: "destructive",
          })
          return false
        }
        break
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(Math.min(steps.length - 1, step + 1))
    }
  }

  const steps = [
    {
      title: "Your Name",
      content: <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />,
    },
    {
      title: "Your Email",
      content: (
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      ),
    },
    {
      title: "Your Contact",
      content: (
        <Input
          placeholder="Enter your contact number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
      ),
    },
    {
      title: "Register your complaint",
      content: (
        <Textarea
          placeholder="Describe your complaint here..."
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          className="min-h-[200px]"
          required
        />
      ),
    },
    {
      title: "Ask for Help",
      content: (
        <Textarea
          placeholder="What kind of help do you need?"
          value={helpRequest}
          onChange={(e) => setHelpRequest(e.target.value)}
          className="min-h-[200px]"
          required
        />
      ),
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween" }}
          className="fixed inset-y-0 left-0 w-full sm:w-96 bg-background border-r border-border shadow-lg z-50"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{steps[step].title}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {steps[step].content}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                >
                  Previous
                </Button>

                {step < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}