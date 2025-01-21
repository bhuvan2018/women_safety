"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search, ShieldAlert, BadgeAlert, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useJsApiLoader } from "@react-google-maps/api"
import dynamic from "next/dynamic"

const GoogleMap = dynamic(() => import("@react-google-maps/api").then((mod) => mod.GoogleMap), { ssr: false })
const Marker = dynamic(() => import("@react-google-maps/api").then((mod) => mod.Marker), { ssr: false })
const DirectionsRenderer = dynamic(() => import("@react-google-maps/api").then((mod) => mod.DirectionsRenderer), {
  ssr: false,
})
const Circle = dynamic(() => import("@react-google-maps/api").then((mod) => mod.Circle), { ssr: false })

const karnatakaCities = [
  "Bangalore",
  "Mysore",
  "Hubli-Dharwad",
  "Mangalore",
  "Belgaum",
  "Gulbarga",
  "Davanagere",
  "Bellary",
  "Bijapur",
  "Shimoga",
]

interface SafetyZone {
  id: number
  name: string
  type: "hospital" | "police" | "public"
  latitude: number
  longitude: number
  safetyLevel: "safe" | "moderate" | "unsafe"
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
}

const center = {
  lat: 12.9716,
  lng: 77.5946,
}

export default function SafetyZones() {
  const [selectedCity, setSelectedCity] = useState("")
  const [destination, setDestination] = useState("")
  const [safetyZones, setSafetyZones] = useState<SafetyZone[]>([])
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [mapCenter, setMapCenter] = useState(center)
  const [mapZoom, setMapZoom] = useState(12)
  const { toast } = useToast()

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const mapRef = useRef<google.maps.Map | null>(null)

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  useEffect(() => {
    const mockSafetyZones: SafetyZone[] = [
      { id: 1, name: "City Hospital", type: "hospital", latitude: 12.9716, longitude: 77.5946, safetyLevel: "safe" },
      {
        id: 2,
        name: "Central Police Station",
        type: "police",
        latitude: 12.9783,
        longitude: 77.5951,
        safetyLevel: "safe",
      },
      {
        id: 3,
        name: "Public Safe Spot",
        type: "public",
        latitude: 12.9854,
        longitude: 77.6047,
        safetyLevel: "moderate",
      },
      { id: 4, name: "Unsafe Area", type: "public", latitude: 12.9654, longitude: 77.5847, safetyLevel: "unsafe" },
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

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address: selectedCity }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const origin = results[0].geometry.location
        setMapCenter({ lat: origin.lat(), lng: origin.lng() })

        geocoder.geocode({ address: destination }, (destResults, destStatus) => {
          if (destStatus === "OK" && destResults && destResults[0]) {
            const dest = destResults[0].geometry.location
            const directionsService = new google.maps.DirectionsService()

            directionsService.route(
              {
                origin: origin,
                destination: dest,
                travelMode: google.maps.TravelMode.WALKING,
              },
              (result, status) => {
                if (status === "OK" && result) {
                  setDirections(result)
                  toast({
                    title: "Route Calculated",
                    description: `Safe route from ${selectedCity} to ${destination} has been calculated.`,
                  })
                } else {
                  toast({
                    title: "Error",
                    description: "Could not calculate route. Please try again.",
                    variant: "destructive",
                  })
                }
              },
            )
          } else {
            toast({
              title: "Error",
              description: "Could not find destination. Please try again.",
              variant: "destructive",
            })
          }
        })
      } else {
        toast({
          title: "Error",
          description: "Could not find selected city. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  const getSafetyColor = (safetyLevel: string) => {
    switch (safetyLevel) {
      case "safe":
        return "#4CAF50"
      case "moderate":
        return "#FFEB3B"
      case "unsafe":
        return "#F44336"
      default:
        return "#9E9E9E"
    }
  }

  const getZoneIcon = (type: "hospital" | "police" | "public") => {
    switch (type) {
      case "hospital":
        return <ShieldAlert className="h-5 w-5 text-red-500" />
      case "police":
        return <BadgeAlert className="h-5 w-5 text-blue-500" />
      case "public":
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
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
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
              <div className="h-[400px] rounded-lg overflow-hidden">
                {isLoaded ? (
                  <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={mapZoom} onLoad={onMapLoad}>
                    {safetyZones.map((zone) => (
                      <Circle
                        key={zone.id}
                        center={{ lat: zone.latitude, lng: zone.longitude }}
                        radius={200}
                        options={{
                          fillColor: getSafetyColor(zone.safetyLevel),
                          fillOpacity: 0.35,
                          strokeColor: getSafetyColor(zone.safetyLevel),
                          strokeOpacity: 0.8,
                          strokeWeight: 2,
                        }}
                      />
                    ))}
                    {directions && (
                      <DirectionsRenderer
                        directions={directions}
                        options={{
                          polylineOptions: {
                            strokeColor: "#4285F4",
                            strokeWeight: 5,
                          },
                        }}
                      />
                    )}
                  </GoogleMap>
                ) : (
                  <div>Loading map...</div>
                )}
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
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      zone.safetyLevel === "safe"
                        ? "bg-green-500 text-white"
                        : zone.safetyLevel === "moderate"
                          ? "bg-yellow-500 text-gray-900"
                          : "bg-red-500 text-white"
                    }`}
                  >
                    {zone.safetyLevel.charAt(0).toUpperCase() + zone.safetyLevel.slice(1)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}