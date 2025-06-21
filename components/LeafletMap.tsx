'use client';

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface LeafletMapProps {
  location: string;
}

export default function LeafletMap({ location }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Clean up existing map if it exists
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    // Wait for the container to be available
    if (!mapContainerRef.current) return

    // Initialize the map
    const map = L.map(mapContainerRef.current).setView([9.0820, 8.6753], 13)
    mapRef.current = map

    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Add a marker for the business location
    const marker = L.marker([9.0820, 8.6753]).addTo(map)
    marker.bindPopup(location).openPopup()

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [location])

  return <div ref={mapContainerRef} className="w-full h-full" />
} 