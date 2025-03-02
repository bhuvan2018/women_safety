"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MapPin, ThumbsUp, ThumbsDown, Shield, Info } from "lucide-react"
import { Badge } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SafetyReport {
  id: number
  location: string
  status: "safe" | "unsafe"
  tags: string[]
  comment: string
  votes: number
  timestamp: string
}

const availableTags = [
  { value: "well-lit", label: "Well-lit", color: "bg-yellow-500" },
  { value: "crowded", label: "Crowded", color: "bg-blue-500" },
  { value: "cctv", label: "CCTV", color: "bg-green-500" },
  { value: "police-presence", label: "Police Presence", color: "bg-purple-500" },
  { value: "public-transport", label: "Public Transport", color: "bg-indigo-500" },
  { value: "emergency-services", label: "Emergency Services", color: "bg-red-500" },
]

export default function CrowdsourcedSafetyData() {
  const [reports, setReports] = useState<SafetyReport[]>([])
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState<"safe" | "unsafe">("safe")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comment, setComment] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const storedReports = localStorage.getItem("safetyReports")
    if (storedReports) {
      setReports(JSON.parse(storedReports))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location) {
      toast({
        title: "Error",
        description: "Please enter a location.",
        variant: "destructive",
      })
      return
    }

    const newReport: SafetyReport = {
      id: Date.now(),
      location,
      status,
      tags: selectedTags,
      comment,
      votes: 0,
      timestamp: new Date().toISOString(),
    }

    const updatedReports = [newReport, ...reports]
    setReports(updatedReports)
    localStorage.setItem("safetyReports", JSON.stringify(updatedReports))

    toast({
      title: "Report Submitted",
      description: "Thank you for contributing to community safety!",
    })

    setLocation("")
    setStatus("safe")
    setSelectedTags([])
    setComment("")
  }

  const handleVote = (id: number, voteType: "up" | "down") => {
    const updatedReports = reports.map((report) => {
      if (report.id === id) {
        return {
          ...report,
          votes: voteType === "up" ? report.votes + 1 : report.votes - 1,
        }
      }
      return report
    })
    setReports(updatedReports)
    localStorage.setItem("safetyReports", JSON.stringify(updatedReports))
  }

  const getSafetyScore = (location: string) => {
    const locationReports = reports.filter((r) => r.location.toLowerCase() === location.toLowerCase())
    if (locationReports.length === 0) return null
    const safeReports = locationReports.filter((r) => r.status === "safe").length
    return (safeReports / locationReports.length) * 100
  }

  return (
    <Card className="bg-gray-900 border-gray-800 relative before:absolute before:inset-0 before:-z-10 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-orange-500 before:via-red-500 before:to-purple-500">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-500" />
          Crowdsourced Safety Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Location</label>
              <Input
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Safety Status</label>
              <Select onValueChange={(value: "safe" | "unsafe") => setStatus(value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select safety status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safe">Safe Area</SelectItem>
                  <SelectItem value="unsafe">Unsafe Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Safety Features</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag.value}
                  variant={selectedTags.includes(tag.value) ? "default" : "outline"}
                  className={`cursor-pointer ${selectedTags.includes(tag.value) ? tag.color : "hover:bg-gray-700"}`}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag.value) ? prev.filter((t) => t !== tag.value) : [...prev, tag.value],
                    )
                  }}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Additional Details</label>
            <Textarea
              placeholder="Add more details about the location's safety..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            Submit Safety Report
          </Button>
        </motion.form>

        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Recent Reports</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Recent safety reports from community members</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${report.status === "safe" ? "bg-green-900/20" : "bg-red-900/20"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <h4 className="font-semibold text-white">{report.location}</h4>
                    </div>
                    <p className="text-sm text-gray-300">{report.comment}</p>
                    <div className="flex flex-wrap gap-2">
                      {report.tags.map((tag) => {
                        const tagInfo = availableTags.find((t) => t.value === tag)
                        return (
                          <Badge key={tag} className={tagInfo?.color || "bg-gray-700"}>
                            {tagInfo?.label || tag}
                          </Badge>
                        )
                      })}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(report.timestamp).toLocaleDateString()} at{" "}
                      {new Date(report.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(report.id, "up")}
                      className="text-green-500 hover:text-green-400"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="text-white min-w-[2ch] text-center">{report.votes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(report.id, "down")}
                      className="text-red-500 hover:text-red-400"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Area Safety Scores</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 [&>*]:transition-transform [&>*]:duration-200 [&>*]:hover:scale-105">
            {Array.from(new Set(reports.map((r) => r.location))).map((location) => {
              const score = getSafetyScore(location)
              return (
                <motion.div
                  key={location}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span className="text-white font-medium">{location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {score !== null && (
                        <>
                          <div
                            className={`h-2 w-20 bg-gray-700 rounded-full overflow-hidden relative before:absolute before:inset-0 before:rounded-full before:animate-pulse ${
                              score >= 70
                                ? "before:bg-green-500/20"
                                : score >= 40
                                  ? "before:bg-yellow-500/20"
                                  : "before:bg-red-500/20"
                            }`}
                          >
                            <motion.div
                              className={`h-full ${
                                score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              initial={{ width: "0%" }}
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              score >= 70 ? "text-green-500" : score >= 40 ? "text-yellow-500" : "text-red-500"
                            }`}
                          >
                            {score.toFixed(0)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

