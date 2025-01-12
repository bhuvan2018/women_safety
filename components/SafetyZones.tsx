'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Search, ShieldAlert, BadgeAlert, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const karnatakaCities = [
  'Bangalore', 'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belgaum',
  'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga'
]

interface SafetyZone {
  id: number
  name: string
  type: 'hospital' | 'police' | 'public'
  safetyLevel: 'safe' | 'moderate' | 'unsafe'
}

export default function SafetyZones() {
  const [selectedCity, setSelectedCity] = useState('')
  const [destination, setDestination] = useState('')
  const [safetyZones, setSafetyZones] = useState<SafetyZone[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const mockSafetyZones: SafetyZone[] = [
      { id: 1, name: 'City Hospital', type: 'hospital', safetyLevel: 'safe' },
      { id: 2, name: 'Central Police Station', type: 'police', safetyLevel: 'safe' },
      { id: 3, name: 'Public Safe Spot', type: 'public', safetyLevel: 'moderate' },
      { id: 4, name: 'Unsafe Area', type: 'public', safetyLevel: 'unsafe' },
    ]
    setSafetyZones(mockSafetyZones)
  }, [])

  const handleSearch = () => {
    if (!selectedCity || !destination) {
      toast({
        title: "Error",
        description: "Please select a city and enter a destination.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Search Initiated",
      description: `Searching for safe routes from ${selectedCity} to ${destination}.`,
    })
    // Here you would typically integrate with a mapping or routing service
  }

  const getSafetyColor = (safetyLevel: string) => {
    switch (safetyLevel) {
      case 'safe': return 'bg-green-500'
      case 'moderate': return 'bg-yellow-500'
      case 'unsafe': return 'bg-red-500'
      default: return 'bg-gray-500'
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
          Safety Zones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-6">
          Explore our highlighted safety zones with real-time safety scores and helpful tips for a safe and enjoyable experience.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-orange-500" /> Safe Zones Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center text-gray-400">
                <p>Safety zones visualization coming soon</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Find Safe Routes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={setSelectedCity}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {karnatakaCities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Enter your destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button onClick={handleSearch} className="w-full bg-orange-500 hover:bg-orange-600">
                <Search className="mr-2 h-4 w-4" /> Find Safe Route
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Safety Zones</h3>
          <div className="space-y-4">
            {safetyZones.map((zone) => (
              <div key={zone.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center">
                  {getZoneIcon(zone.type)}
                  <span className="ml-2 text-white">{zone.name}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getSafetyColor(zone.safetyLevel)} ${zone.safetyLevel === 'moderate' ? 'text-gray-900' : 'text-white'}`}>
                  {zone.safetyLevel.charAt(0).toUpperCase() + zone.safetyLevel.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}