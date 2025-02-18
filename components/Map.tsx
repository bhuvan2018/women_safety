"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Polyline, useMap, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface SafetyZone {
  id: number;
  name: string;
  type: "hospital" | "police" | "public";
  latitude: number;
  longitude: number;
  safetyLevel: "safe" | "moderate" | "unsafe";
}

interface Route {
  path: [number, number][];
  safetyZones: SafetyZone[];
}

interface MapProps {
  routes: Route[];
}

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const MapComponent = ({ routes }: MapProps) => {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const center: [number, number] = [12.9716, 77.5946]; // Bangalore coordinates

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  const getSafetyColor = (safetyLevel: string) => {
    switch (safetyLevel) {
      case "safe":
        return "green";
      case "moderate":
        return "yellow";
      case "unsafe":
        return "red";
      default:
        return "gray";
    }
  };

  const routeColors = ["#3388ff", "#ff3388", "#88ff33"];

  if (!isMounted) {
    return <div className="h-[400px] w-full bg-gray-800 rounded-lg animate-pulse" />;
  }

  return (
    <MapContainer
      key={JSON.stringify(routes)} // Force reinitialization when routes change
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      whenReady={() => setMapInstance(mapInstance)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController routes={routes} />
      {routes.map((route, index) => (
        <div key={index}>
          <Polyline
            positions={route.path}
            pathOptions={{ color: routeColors[index], weight: 5, opacity: 0.7 }}
          />
          {route.safetyZones.map((zone) => (
            <Marker
              key={`${index}-${zone.id}`}
              position={[zone.latitude, zone.longitude]}
              icon={createCustomIcon(getSafetyColor(zone.safetyLevel))}
            >
              <Popup>
                Route {index + 1}: {zone.name} - {zone.safetyLevel}
              </Popup>
            </Marker>
          ))}
        </div>
      ))}
    </MapContainer>
  );
};

const MapController = ({ routes }: { routes: Route[] }) => {
  const map = useMap();

  useEffect(() => {
    if (routes.length > 0) {
      const allPoints = routes.flatMap((route) => route.path);
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, routes]);

  return null;
};

export default MapComponent;