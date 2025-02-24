"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { loginAdmin } from "@/lib/auth"
import { useRouter } from "next/navigation"
import type React from "react"

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const admin = await loginAdmin(email, password)
      if (admin) {
        toast({
          title: "Admin Login Successful",
          description: "You have been logged in as an admin.",
        })
        onClose()
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Admin login error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during admin login.",
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
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isLoading ? "Logging in..." : "Admin Login"}
              </Button>
            </form>
            <button onClick={onClose} className="mt-4 text-gray-400 hover:text-white absolute top-2 right-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

