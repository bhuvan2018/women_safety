'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendOTP, verifyOTP } from '../actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSendOTP = async () => {
    setIsLoading(true)
    try {
      const result = await sendOTP(mobileNumber)
      if (result.success) {
        setOtpSent(true)
        toast({
          title: "OTP Sent",
          description: "Please check your mobile for the OTP.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setIsLoading(true)
    try {
      const result = await verifyOTP(mobileNumber, otp)
      if (result.success) {
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully.",
        })
        onClose()
        window.location.reload() // Refresh the page to update login state
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-300 mb-1">
                  Mobile Number
                </label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  required
                />
              </div>
              {otpSent && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
                    OTP
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                  />
                </div>
              )}
              {!otpSent ? (
                <Button
                  onClick={handleSendOTP}
                  disabled={isLoading || mobileNumber.length < 10}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              ) : (
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length < 6}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              )}
            </form>
            <button onClick={onClose} className="mt-4 text-gray-400 hover:text-white">Close</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

