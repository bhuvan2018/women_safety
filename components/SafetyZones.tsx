'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Search, ShieldAlert, BadgeAlert, Shield, Sun, Cloud, CloudRain } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from './LanguageContext'

interface SafetyZone {
  id: number
  area: string
  score: number
  weather: {
    condition: 'sunny' | 'cloudy' | 'rainy'
    temperature: number
    humidity: number
  }
  tips: string[]
  image: string
}

export default function SafetyZones() {
  const { t } = useLanguage()
  const [currentTime, setCurrentTime] = useState(new Date())
  const { toast } = useToast()

  const safetyData: SafetyZone[] = [
    {
      id: 1,
      area: "Puttur",
      score: 95,
      weather: { condition: 'sunny', temperature: 28, humidity: 65 },
      tips: [
        "Enjoy the serene Kumaradhara River",
        "Visit the historic Mahalingeshwara Temple",
        "Try local Malnad cuisine"
      ],
      image: "/placeholder.svg?height=150&width=300"
    },
    {
      id: 2,
      area: "Vittla",
      score: 88,
      weather: { condition: 'cloudy', temperature: 26, humidity: 70 },
      tips: [
        "Explore the beautiful Vittla Raj Temple",
        "Participate in local cultural events",
        "Visit nearby cashew plantations"
      ],
      image: "/placeholder.svg?height=150&width=300"
    },
    {
      id: 3,
      area: "Mangalore",
      score: 82,
      weather: { condition: 'rainy', temperature: 24, humidity: 80 },
      tips: [
        "Relax at Panambur Beach",
        "Visit the famous Mangaladevi Temple",
        "Try delicious Mangalorean seafood"
      ],
      image: "/placeholder.svg?height=150&width=300"
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 80) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getWeatherIcon = (condition: 'sunny' | 'cloudy' | 'rainy') => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />
    }
  }

  const getZoneIcon = (type: 'hospital' | 'police' | 'public') => {
    switch (type) {
      case 'hospital':
        return <ShieldAlert className="h-5 w-5 text-red-500" />
      case 'police':
        return <BadgeAlert className="h-5 w-5 text-blue-500" />
      case 'public':
        return <Shield className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-500" />
          {t('safetyZones')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-6">
          Explore our highlighted safety zones with real-time safety scores, weather information, and helpful tips for a safe and enjoyable experience.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {safetyData.map((zone) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg overflow-hidden bg-gray-800 shadow-lg"
            >
              <div className="relative h-40">
                <img src={zone.image} alt={zone.area} className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900 opacity-70"></div>
                <div className="absolute bottom-2 left-2 flex items-center">
                  <MapPin className="h-5 w-5 text-white mr-1" />
                  <h3 className="font-semibold text-white text-lg">{zone.area}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className={`text-2xl font-bold ${getScoreColor(zone.score)}`}>
                    {zone.score}% Safe
                  </p>
                  <div className="flex items-center">
                    {getWeatherIcon(zone.weather.condition)}
                    <p className="text-sm text-gray-400 ml-2">{zone.weather.temperature}°C</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">Updated: {currentTime.toLocaleTimeString()}</p>
                <h4 className="text-white font-semibold mb-1">Local Tips:</h4>
                <ul className="list-disc list-inside text-sm text-gray-400">
                  {zone.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-6 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          onClick={() => window.location.href = '/safety-zones'}
        >
          {t('viewAllSafetyZones')}
        </Button>
      </CardContent>
    </Card>
  )
}

