'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { MapPin, ThumbsUp, ThumbsDown } from 'lucide-react'

interface SafetyReport {
  id: number
  location: string
  status: 'safe' | 'unsafe'
  tags: string[]
  comment: string
  votes: number
}

export default function CrowdsourcedSafetyData() {
  const [reports, setReports] = useState<SafetyReport[]>([])
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState<'safe' | 'unsafe'>('safe')
  const [tags, setTags] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const storedReports = localStorage.getItem('safetyReports')
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
      tags,
      comment,
      votes: 0
    }

    const updatedReports = [...reports, newReport]
    setReports(updatedReports)
    localStorage.setItem('safetyReports', JSON.stringify(updatedReports))

    toast({
      title: "Report Submitted",
      description: "Thank you for contributing to community safety!",
    })

    setLocation('')
    setStatus('safe')
    setTags([])
    setComment('')
  }

  const handleVote = (id: number, voteType: 'up' | 'down') => {
    const updatedReports = reports.map(report => {
      if (report.id === id) {
        return {
          ...report,
          votes: voteType === 'up' ? report.votes + 1 : report.votes - 1
        }
      }
      return report
    })
    setReports(updatedReports)
    localStorage.setItem('safetyReports', JSON.stringify(updatedReports))
  }

  const getSafetyScore = (location: string) => {
    const locationReports = reports.filter(r => r.location.toLowerCase() === location.toLowerCase())
    if (locationReports.length === 0) return null
    const safeReports = locationReports.filter(r => r.status === 'safe').length
    return (safeReports / locationReports.length) * 100
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Crowdsourced Safety Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Select onValueChange={(value: 'safe' | 'unsafe') => setStatus(value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select safety status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="safe">Safe</SelectItem>
              <SelectItem value="unsafe">Unsafe</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setTags([...tags, value])}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Add tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="well-lit">Well-lit</SelectItem>
              <SelectItem value="crowded">Crowded</SelectItem>
              <SelectItem value="risky">Risky</SelectItem>
              <SelectItem value="quiet">Quiet</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <Textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            Submit Report
          </Button>
        </form>

        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-white">Recent Reports</h3>
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                report.status === 'safe' ? 'bg-green-900/20' : 'bg-red-900/20'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white">{report.location}</h4>
                  <p className="text-sm text-gray-400">{report.comment}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                  {report.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(report.id, 'up')}
                  className="text-green-500 hover:text-green-400"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Upvote
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(report.id, 'down')}
                  className="text-red-500 hover:text-red-400"
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Downvote
                </Button>
                <span className="text-white ml-2">{report.votes}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Safety Scores</h3>
          {Array.from(new Set(reports.map(r => r.location))).map((location) => {
            const score = getSafetyScore(location)
            return (
              <div key={location} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg mb-2">
                <span className="text-white">{location}</span>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-orange-500 mr-2" />
                  <span className={`font-semibold ${
                    score && score >= 70 ? 'text-green-500' :
                    score && score >= 40 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {score ? `${score.toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

