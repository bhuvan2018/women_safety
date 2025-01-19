'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await emailjs.send(
        'service_o17yyqp',
        'template_0f6e8pl',
        {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
        },
        'x2oCH1LfVilF8i5ij'
      )

      console.log(result.text)
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
      })
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (error) {
      console.error('Error sending email:', error)
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-24">
      {/* Hero Section with Background Image */}
      <div className="relative h-[300px] w-full">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bcad567c-ae77-4f5a-829a-b93f3cfaed57-Gy8ZwOXcbi5A2imffTUMO24dE2Mq11.jpeg"
            alt="Emotional Portrait"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950"></div>
        </div>
        <div className="relative z-10 container mx-auto h-full flex items-center justify-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact Us
          </motion.h1>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-2 bg-gray-900 rounded-lg p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-8 text-orange-500">LET'S GET IN TOUCH</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    placeholder="YOUR NAME..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="YOUR EMAIL..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <Input
                  placeholder="SUBJECT..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
                <Textarea
                  placeholder="YOUR MESSAGE..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white h-40"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-orange-500 rounded-lg p-8 text-white">
              <div className="space-y-8">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-2" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Phone Number</h3>
                    <p className="text-lg">6361782350</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-2" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Email Address</h3>
                    <p className="text-lg">bhuvanshetty2018@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 mr-2" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Street Address</h3>
                    <p className="text-lg">
                      Nehru Nagara, Puttur 574201
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Location</h3>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15573.084654894684!2d75.18795037775878!3d12.760096899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba4bd3c5b0d7c7f%3A0x5c0a4c1f5c5d5c5d!2sNehru%20Nagara%2C%20Puttur%2C%20Karnataka%20574201!5e0!3m2!1sen!2sin!4v1625123456789!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}