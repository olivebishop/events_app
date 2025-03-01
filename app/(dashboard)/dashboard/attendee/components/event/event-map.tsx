"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin } from "lucide-react"
import ReactDOMServer from 'react-dom/server'
import type { DivIcon, Icon, LatLngExpression } from 'leaflet'

// Dynamic imports for map components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

const events = [
  { id: 1, name: "Summer Music Festival", lat: 40.7829, lng: -73.9654, type: "Music" },
  { id: 2, name: "Food & Wine Expo", lat: -4.0435, lng: 39.6682, type: "Food & Drink" },
  { id: 3, name: "Tech Conference 2023", lat: 37.7749, lng: -122.4194, type: "Technology" },
]

const eventColors = {
  Music: "bg-red-500",
  "Food & Drink": "bg-orange-500",
  Technology: "bg-blue-500"
}

function MapSkeleton() {
  return (
    <div className="relative">
      {/* Map skeleton */}
      <Skeleton className="h-[600px] w-full rounded-lg" />
      
      {/* Events list skeleton */}
      <Card className="absolute right-2 top-2 z-[1000] w-[300px]">
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map controls skeleton */}
      <div className="absolute left-2 top-2 z-[1000]">
        <div className="space-y-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      {/* Scale indicator skeleton */}
      <div className="absolute bottom-2 left-2 z-[1000]">
        <Skeleton className="h-2 w-16" />
      </div>
    </div>
  )
}

function MapComponent() {
  const [isMounted, setIsMounted] = useState(false)
  const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null)

  useEffect(() => {
    const loadDependencies = async () => {
      const L = await import('leaflet')
      // Add Leaflet CSS to head
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
      
      setLeaflet(L)
      setIsMounted(true)
    }

    loadDependencies()
  }, [])

  const createCustomIcon = (color: string): DivIcon | Icon | undefined => {
    if (!leaflet) return undefined;
    
    const html = ReactDOMServer.renderToString(
      <MapPin className={color.replace('bg-', 'text-')} size={24} />
    );
    
    return leaflet.divIcon({
      html,
      className: 'custom-map-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
  }

  if (!isMounted || !leaflet) {
    return <MapSkeleton />
  }

  return (
    <div className="relative">
      <MapContainer 
        center={[0, 0] as LatLngExpression} 
        zoom={2} 
        style={{ height: "600px", width: "100%" }} 
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng] as LatLngExpression}
            icon={createCustomIcon(eventColors[event.type as keyof typeof eventColors])}
          >
            <Popup>
              <strong>{event.name}</strong>
              <br />
              Type: {event.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <EventList />
    </div>
  )
}

function EventList() {
  return (
    <Card className="absolute right-2 top-2 z-[1000] max-h-[calc(100%-20px)] overflow-y-auto w-[300px]">
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded transition-colors"
            >
              <MapPin className={`w-4 h-4 mr-2 ${eventColors[event.type as keyof typeof eventColors].replace('bg-', 'text-')}`} />
              {event.name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default function EventMap() {
  return <MapComponent />
}