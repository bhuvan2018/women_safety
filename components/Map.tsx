"use client"

import { useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Polyline, useMap, Popup, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"

interface SafetyZone {
  id: number
  name: string
  type: "hospital" | "police" | "public"
  latitude: number
  longitude: number
  safetyLevel: "safe" | "moderate" | "unsafe"
  landmark?: string
}

interface Route {
  path: [number, number][]
  safetyZones: SafetyZone[]
  routeDescription: string
}

interface MapProps {
  routes: Route[]
}

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

const MapComponent = forwardRef<L.Map, MapProps>(({ routes }, ref) => {
  const center: [number, number] = [12.9716, 77.5946] // Bangalore coordinates

  useImperativeHandle(ref, () => {
    return mapRef.current as L.Map
  })

  const mapRef = useRef<L.Map | null>(null)

  const getSafetyColor = (safetyLevel: string) => {
    switch (safetyLevel) {
      case "safe":
        return "green"
      case "moderate":
        return "yellow"
      case "unsafe":
        return "red"
      default:
        return "gray"
    }
  }

  const routeColors = ["#3388ff", "#ff3388", "#88ff33", "#ff8833", "#33ff88"]

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} ref={mapRef}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routes.map((route, index) => (
        <div key={index}>
          <Polyline
            positions={route.path}
            pathOptions={{
              color: routeColors[index],
              weight: 5,
              opacity: 0.7,
              dashArray: route.routeDescription.includes("fastest") ? "10, 10" : undefined,
            }}
          />
          {route.safetyZones.map((zone) => (
            <Marker
              key={`${index}-${zone.id}`}
              position={[zone.latitude, zone.longitude]}
              icon={createCustomIcon(getSafetyColor(zone.safetyLevel))}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{zone.name}</p>
                  <p className="text-gray-600">{zone.landmark}</p>
                  <p className="capitalize mt-1">
                    Route {index + 1} - {zone.type}
                  </p>
                  <p className={`mt-1 font-medium text-${getSafetyColor(zone.safetyLevel).replace("bg-", "")}`}>
                    Safety: {zone.safetyLevel}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </div>
      ))}
      <MapController routes={routes} />
    </MapContainer>
  )
})

MapComponent.displayName = "MapComponent"

const MapController = ({ routes }: { routes: Route[] }) => {
  const map = useMap()

  useEffect(() => {
    if (routes.length > 0) {
      const allPoints = routes.flatMap((route) => route.path)
      const bounds = L.latLngBounds(allPoints)
      map.fitBounds(bounds)
    }
  }, [map, routes])

  return null
}

export default MapComponent