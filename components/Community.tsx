'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast'
import { MessageCircle, AlertTriangle, Loader } from 'lucide-react'
import { useLanguage } from './LanguageContext'

interface Report {
  id: number
  type: string
  content: string
  created_at: string
}

interface CommunityProps {
  onIncidentSubmit: () => void
}

export default function Community({ onIncidentSubmit }: CommunityProps) {
  const { t } = useLanguage()
  const [story, setStory] = useState('')
  const [incident, setIncident] = useState('')
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedReports = localStorage.getItem('communityReports')
    if (storedReports) {
      setReports(JSON.parse(storedReports))
    }
  }, [])

  const handleSubmit = (type: 'story' | 'incident') => {
    const content = type === 'story' ? story : incident
    if (!content.trim()) {
      toast({
        title: "Empty Submission",
        description: "Please enter some content before submitting.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)

    setTimeout(() => {
      const newReport: Report = {
        id: Date.now(),
        type,
        content,
        created_at: new Date().toISOString()
      }
      
      const updatedReports = [newReport, ...reports].slice(0, 10)
      setReports(updatedReports)
      localStorage.setItem('communityReports', JSON.stringify(updatedReports))
      
      toast({
        title: type === 'story' ? t('storySubmitted') : t('incidentReported'),
        description: t('thankYouForSharing'),
      })
      
      if (type === 'story') setStory('')
      else setIncident('')

      onIncidentSubmit()
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-orange-500" />
          {t('community')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stories" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stories">{t('stories')}</TabsTrigger>
            <TabsTrigger value="incidents">{t('incidents')}</TabsTrigger>
          </TabsList>
          <TabsContent value="stories">
            <Textarea
              placeholder={t('shareYourStory')}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="min-h-[100px] mb-2"
            />
            <Button 
              onClick={() => handleSubmit('story')}
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Submitting...' : t('submitStory')}
            </Button>
          </TabsContent>
          <TabsContent value="incidents">
            <Textarea
              placeholder={t('reportIncident')}
              value={incident}
              onChange={(e) => setIncident(e.target.value)}
              className="min-h-[100px] mb-2"
            />
            <Button 
              onClick={() => handleSubmit('incident')}
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Submitting...' : t('submitReport')}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">{t('recentReports')}</h3>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-20"
            >
              <Loader className="h-8 w-8 animate-spin text-orange-500" />
            </motion.div>
          ) : (
            <AnimatePresence>
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-muted p-4 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p>{report.content}</p>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        {report.type === 'incident' ? (
                          <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                        ) : (
                          <MessageCircle className="h-4 w-4 mr-1 text-blue-500" />
                        )}
                        {report.type}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  )
}