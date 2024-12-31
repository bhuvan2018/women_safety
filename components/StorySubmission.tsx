'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

export default function StorySubmission() {
  const [story, setStory] = useState('')
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle the story submission
    console.log('Story submitted:', story)
    toast({
      title: "Story Submitted",
      description: "Thank you for sharing your story. We are here to support you.",
    })
    setStory('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12"
    >
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Tell Us Your Story</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Share your story with us. Your voice matters."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="min-h-[200px] bg-gray-800 border-gray-700 text-white"
            />
            <Button 
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Submit Story
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

