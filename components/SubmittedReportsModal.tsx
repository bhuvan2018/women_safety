"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface SubmittedReportsModalProps {
  isOpen: boolean
  onClose: () => void
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

export default function SubmittedReportsModal({ isOpen, onClose }: SubmittedReportsModalProps) {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    const storedReports = localStorage.getItem("navbarReports")
    if (storedReports) {
      setReports(JSON.parse(storedReports))
    }
  }, [isOpen])

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
            className="bg-background p-8 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Submitted Reports</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            {reports.length === 0 ? (
              <p>No reports submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-muted p-4 rounded-lg">
                    <p className="font-semibold">{report.name}</p>
                    <p className="text-sm text-muted-foreground">Email: {report.email}</p>
                    <p className="text-sm text-muted-foreground">Contact: {report.contact}</p>
                    <p className="mt-2">
                      <strong>Type:</strong> {report.type}
                    </p>
                    <p className="mt-2">{report.content}</p>
                    <p className="text-sm text-muted-foreground mt-2">{new Date(report.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

