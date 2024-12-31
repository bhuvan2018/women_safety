'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AIStats() {
  const stats = [
    { label: "Crime Scene Detection Accuracy", value: "97%" },
    { label: "Audio Summarization and Classification Accuracy", value: "92%" },
    { label: "Help Hand Signal Detection Accuracy", value: "96%" },
    { label: "Scream Detection Accuracy", value: "97%" }
  ]

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">AI-Powered Safety Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center"
            >
              <span className="text-gray-400">{stat.label}</span>
              <span className="text-orange-500 font-bold">{stat.value}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

