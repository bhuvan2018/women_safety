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
  latitude: number
  longitude: number
}

export default function SafetyZones() {
  const [selectedCity, setSelectedCity] = useState('')
  const [destination, setDestination] = useState('')
  const [safetyZones, setSafetyZones] = useState<SafetyZone[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [newZoneName, setNewZoneName] = useState('')
  const [newZoneType, setNewZoneType] = useState<'hospital' | 'police' | 'public'>('public')
  const [newZoneLatitude, setNewZoneLatitude] = useState('')
  const [newZoneLongitude, setNewZoneLongitude] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const mockSafetyZones: SafetyZone[] = [
      { id: 1, name: 'City Hospital', type: 'hospital', latitude: 12.9716, longitude: 77.5946 },
      { id: 2, name: 'Central Police Station', type: 'police', latitude: 12.9783, longitude: 77.5951 },
      { id: 3, name: 'Public Safe Spot', type: 'public', latitude: 12.9854, longitude: 77.6047 },
    ]
    setSafetyZones(mockSafetyZones)
  }, [])

  const handleSearch = () => {
    console.log('Searching for route from', selectedCity, 'to', destination)
    toast({
      title: "Route Search",
      description: `Searching for a safe route from ${selectedCity} to ${destination}`,
    })
  }

  const handleAddZone = () => {
    if (!newZoneName || !newZoneType || !newZoneLatitude || !newZoneLongitude) {
      toast({
        title: "Error",
        description: "Please fill in all fields for the new safety zone.",
        variant: "destructive",
      })
      return
    }

    const newZone: SafetyZone = {
      id: Date.now(),
      name: newZoneName,
      type: newZoneType,
      latitude: parseFloat(newZoneLatitude),
      longitude: parseFloat(newZoneLongitude),
    }

    setSafetyZones([...safetyZones, newZone])
    toast({
      title: "Safety Zone Added",
      description: `${newZoneName} has been added to the safety zones.`,
    })

    setNewZoneName('')
    setNewZoneType('public')
    setNewZoneLatitude('')
    setNewZoneLongitude('')
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
    <div className="min-h-screen bg-gray-950 pt-24">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-4xl font-bold text-orange-500 mb-8 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Safety Zones in Karnataka
        </motion.h1>

        <Card className="bg-gray-900 border-gray-800 mb-8">
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

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-orange-500" /> Safe Zones Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 h-64 flex items-center justify-center text-gray-400">
                Map will be displayed here
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Safety Zones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {safetyZones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center">
                    {getZoneIcon(zone.type)}
                    <span className="ml-2 text-white">{zone.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {isAdmin && (
          <Card className="bg-gray-900 border-gray-800 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Add New Safety Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Zone Name"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Select onValueChange={(value: 'hospital' | 'police' | 'public') => setNewZoneType(value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Zone Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="police">Police Station</SelectItem>
                  <SelectItem value="public">Public Safe Spot</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Latitude"
                value={newZoneLatitude}
                onChange={(e) => setNewZoneLatitude(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                placeholder="Longitude"
                value={newZoneLongitude}
                onChange={(e) => setNewZoneLongitude(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button onClick={handleAddZone} className="w-full bg-orange-500 hover:bg-orange-600">
                Add Safety Zone
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

