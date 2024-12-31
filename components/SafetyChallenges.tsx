'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import { useLanguage } from './LanguageContext'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Challenge {
  id: number
  title: string
  description: string
  completed: boolean
  icon: React.ElementType
}

interface SafetyChallengesProps {
  onIncidentReportClick: () => void
  hasSubmittedIncident: boolean
}

export default function SafetyChallenges({ onIncidentReportClick, hasSubmittedIncident }: SafetyChallengesProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [showAlert, setShowAlert] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: "Incident Reporting",
      description: "Submit an incident report or share your story in the Community section.",
      completed: false,
      icon: AlertTriangle
    },
    {
      id: 2,
      title: "Safety Awareness",
      description: "Review and acknowledge key safety tips and precautions.",
      completed: false,
      icon: CheckCircle
    },
    {
      id: 3,
      title: "Community Guardian",
      description: "Participate in community safety initiatives and support fellow users.",
      completed: false,
      icon: Award
    }
  ])

  const completeChallenge = (id: number) => {
    setChallenges(challenges.map(challenge => 
      challenge.id === id ? { ...challenge, completed: true } : challenge
    ))
    toast({
      title: "Challenge Completed!",
      description: `Congratulations! You've completed the "${challenges.find(c => c.id === id)?.title}" challenge.`,
    })
  }

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    if (challenge.id === 1 && !hasSubmittedIncident) {
      onIncidentReportClick()
    } else {
      setShowAlert(true)
    }
  }

  const handleAlertConfirm = () => {
    if (selectedChallenge) {
      completeChallenge(selectedChallenge.id)
    }
    setShowAlert(false)
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-orange-500" />
          {t('safetyChallenges')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-6">
          Complete these challenges to enhance your safety skills and contribute to our community's well-being.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`p-4 rounded-lg ${
                challenge.completed ? 'bg-green-900/20' : 'bg-gray-800'
              }`}
            >
              <div className="flex items-center mb-2">
                <challenge.icon className={`h-6 w-6 ${
                  challenge.completed ? 'text-green-500' : 'text-orange-500'
                } mr-2`} />
                <h3 className="font-semibold text-white">{challenge.title}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">{challenge.description}</p>
              <Button 
                variant="outline"
                size="sm"
                className={`w-full ${
                  challenge.completed
                    ? 'border-green-500 text-green-500 hover:bg-green-500'
                    : 'border-orange-500 text-orange-500 hover:bg-orange-500'
                } hover:text-white`}
                onClick={() => handleChallengeClick(challenge)}
                disabled={challenge.completed}
              >
                {challenge.completed ? 'Completed' : 'Start Challenge'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedChallenge?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedChallenge?.id === 2 ? (
                <div>
                  <h4 className="font-semibold mb-2">Key Safety Tips:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Always be aware of your surroundings</li>
                    <li>Trust your instincts</li>
                    <li>Keep your phone charged and easily accessible</li>
                    <li>Share your location with trusted contacts</li>
                    <li>Learn basic self-defense techniques</li>
                  </ul>
                </div>
              ) : selectedChallenge?.id === 3 ? (
                <div>
                  <h4 className="font-semibold mb-2">Community Guardian Actions:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Participate in local safety awareness programs</li>
                    <li>Report unsafe areas or incidents promptly</li>
                    <li>Offer support to fellow community members</li>
                    <li>Share safety tips and resources</li>
                    <li>Encourage others to use the SafeWalk app</li>
                  </ul>
                </div>
              ) : (
                "Are you sure you want to complete this challenge?"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAlertConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

