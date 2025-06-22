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

    // Fix Leaflet default icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEM1LjU5NiAwIDAgNS41OTYgMCAxMi41QzAgMTkuNDA0IDUuNTk2IDI1IDEyLjUgMjVDMTkuNDA0IDI1IDI1IDE5LjQwNCAyNSAxMi41QzI1IDUuNTk2IDE5LjQwNCAwIDEyLjUgMFoiIGZpbGw9IiMzMzMiLz4KPHBhdGggZD0iTTEyLjUgNkM5LjQ2MiA2IDcgOC40NjIgNyAxMS41QzcgMTQuNTM4IDkuNDYyIDE3IDEyLjUgMTdDMTUuNTM4IDE3IDE4IDE0LjUzOCAxOCAxMS41QzE4IDguNDYyIDE1LjUzOCA2IDEyLjUgNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEM1LjU5NiAwIDAgNS41OTYgMCAxMi41QzAgMTkuNDA0IDUuNTk2IDI1IDEyLjUgMjVDMTkuNDA0IDI1IDI1IDE5LjQwNCAyNSAxMi41QzI1IDUuNTk2IDE5LjQwNCAwIDEyLjUgMFoiIGZpbGw9IiMzMzMiLz4KPHBhdGggZD0iTTEyLjUgNkM5LjQ2MiA2IDcgOC40NjIgNyAxMS41QzcgMTQuNTM4IDkuNDYyIDE3IDEyLjUgMTdDMTUuNTM4IDE3IDE4IDE0LjUzOCAxOCAxMS41QzE4IDguNDYyIDE1LjUzOCA2IDEyLjUgNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
      shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAuNSIgY3k9IjIwLjUiIHI9IjE4LjUiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4K'
    });

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