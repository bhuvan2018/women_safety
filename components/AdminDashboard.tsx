"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { logoutUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface Report {
  id: number
  type: string
  content: string
  created_at: string
  user: {
    name: string
    email: string
  }
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [sosAlerts, setSOSAlerts] = useState<Report[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Fetch reports and SOS alerts
    const storedReports = localStorage.getItem("navbarReports")
    const storedSOSAlerts = localStorage.getItem("sosAlerts")

    if (storedReports) {
      setReports(JSON.parse(storedReports))
    }

    if (storedSOSAlerts) {
      setSOSAlerts(JSON.parse(storedSOSAlerts))
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully.",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-3/4 h-3/4 overflow-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <p className="text-gray-400">No reports submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="bg-gray-700 p-4 rounded-lg">
                      <p className="font-semibold text-white">{report.type}</p>
                      <p className="text-gray-300 mt-2">{report.content}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Submitted by: {report.user.name} ({report.user.email})
                      </p>
                      <p className="text-sm text-gray-400 mt-1">{new Date(report.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">SOS Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {sosAlerts.length === 0 ? (
                <p className="text-gray-400">No SOS alerts triggered yet.</p>
              ) : (
                <div className="space-y-4">
                  {sosAlerts.map((alert) => (
                    <div key={alert.id} className="bg-red-900/20 p-4 rounded-lg">
                      <p className="font-semibold text-white">SOS Alert</p>
                      <p className="text-gray-300 mt-2">{alert.content}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Triggered by: {alert.user.name} ({alert.user.email})
                      </p>
                      <p className="text-sm text-gray-400 mt-1">{new Date(alert.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <Button onClick={handleLogout} className="mt-8 bg-red-500 hover:bg-red-600 text-white">
          Logout
        </Button>
      </div>
    </motion.div>
  )
}