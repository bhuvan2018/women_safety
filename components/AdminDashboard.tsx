"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { logoutUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, MessageSquare, User } from "lucide-react"

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

interface SOSAlert {
  id: number
  type: string
  content: string
  created_at: string
  user: {
    name: string
    email: string
  }
  location?: {
    latitude: number
    longitude: number
    name: string
  }
}

interface UserActivity {
  email: string
  name: string
  reports: number
  sosAlerts: number
  lastActive: string
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [sosAlerts, setSOSAlerts] = useState<SOSAlert[]>([])
  const [userActivities, setUserActivities] = useState<UserActivity[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Fetch reports and SOS alerts
    const storedReports = localStorage.getItem("navbarReports")
    const storedSOSAlerts = localStorage.getItem("sosAlerts")

    const reports = storedReports ? JSON.parse(storedReports) : []
    const alerts = storedSOSAlerts ? JSON.parse(storedSOSAlerts) : []

    setReports(reports)
    setSOSAlerts(alerts)

    // Process user activities
    const userMap = new Map<string, UserActivity>()

    // Process reports
    reports.forEach((report: Report) => {
      if (report.user?.email) {
        const activity = userMap.get(report.user.email) || {
          email: report.user.email,
          name: report.user.name || "Unknown",
          reports: 0,
          sosAlerts: 0,
          lastActive: report.created_at,
        }
        activity.reports++
        if (new Date(report.created_at) > new Date(activity.lastActive)) {
          activity.lastActive = report.created_at
        }
        userMap.set(report.user.email, activity)
      }
    })

    // Process SOS alerts
    alerts.forEach((alert: SOSAlert) => {
      if (alert.user?.email) {
        const activity = userMap.get(alert.user.email) || {
          email: alert.user.email,
          name: alert.user.name || "Unknown",
          reports: 0,
          sosAlerts: 0,
          lastActive: alert.created_at,
        }
        activity.sosAlerts++
        if (new Date(alert.created_at) > new Date(activity.lastActive)) {
          activity.lastActive = alert.created_at
        }
        userMap.set(alert.user.email, activity)
      }
    })

    setUserActivities(Array.from(userMap.values()))
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-gray-900 p-8 overflow-auto"
    >
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid grid-cols-3 gap-4 bg-gray-800 p-1">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="sos" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            SOS Alerts
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            User Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
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
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-white">{report.type}</p>
                          <p className="text-gray-300 mt-2">{report.content}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-orange-400">{report.user.name}</p>
                          <p className="text-sm text-gray-400">{report.user.email}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{new Date(report.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sos">
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
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-white">SOS Alert</p>
                          <p className="text-gray-300 mt-2">{alert.content}</p>
                          {alert.location && (
                            <p className="text-sm text-orange-400 mt-1">
                              Location: {alert.location.name} ({alert.location.latitude}, {alert.location.longitude})
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-orange-400">{alert.user.name}</p>
                          <p className="text-sm text-gray-400">{alert.user.email}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{new Date(alert.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {userActivities.length === 0 ? (
                <p className="text-gray-400">No user activity recorded yet.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userActivities.map((activity) => (
                    <div key={activity.email} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-orange-400" />
                        <p className="font-semibold text-white">{activity.name}</p>
                      </div>
                      <p className="text-sm text-gray-400">{activity.email}</p>
                      <div className="mt-3 space-y-1">
                        <p className="text-sm">
                          <span className="text-orange-400">Reports:</span>{" "}
                          <span className="text-white">{activity.reports}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-orange-400">SOS Alerts:</span>{" "}
                          <span className="text-white">{activity.sosAlerts}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-orange-400">Last Active:</span>{" "}
                          <span className="text-white">{new Date(activity.lastActive).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleLogout} className="mt-8 bg-red-500 hover:bg-red-600 text-white">
        Logout
      </Button>
    </motion.div>
  )
}