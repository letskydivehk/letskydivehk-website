'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLocations } from '@/hooks/useLocations'
import { MapPin } from 'lucide-react'

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom orange marker for dropzones
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// City coordinates mapping
const cityCoordinates: Record<string, [number, number]> = {
  'Pattaya': [12.9236, 100.8825],
  'Chiang Mai': [18.7883, 98.9853],
  'Huizhou': [23.1107, 114.4158],
  'Hainan': [20.0442, 110.1999],
  'Luoding': [22.7570, 111.5740],
  'Zhuhai': [22.2707, 113.5767],
}

export function LocationsMap() {
  const { data: locations, isLoading } = useLocations()

  if (isLoading || !locations || locations.length === 0) {
    return null
  }

  // Get coordinates for locations
  const mappedLocations = locations
    .filter(loc => loc.City && cityCoordinates[loc.City])
    .map(loc => ({
      ...loc,
      coords: cityCoordinates[loc.City!] as [number, number]
    }))

  if (mappedLocations.length === 0) {
    return null
  }

  // Calculate center point
  const centerLat = mappedLocations.reduce((sum, loc) => sum + loc.coords[0], 0) / mappedLocations.length
  const centerLng = mappedLocations.reduce((sum, loc) => sum + loc.coords[1], 0) / mappedLocations.length

  return (
    <div className="mt-16 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Explore Our Dropzones
        </h3>
        <p className="text-muted-foreground">
          Click on markers to see location details
        </p>
      </div>
      
      <div className="bg-card rounded-2xl clean-border overflow-hidden elevated-shadow">
        <div className="aspect-[16/9] relative">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mappedLocations.map((location) => (
              <Marker
                key={location.id}
                position={location.coords}
                icon={orangeIcon}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-accent-orange" />
                      <span className="text-xs text-muted-foreground">
                        {location.City}, {location.country}
                      </span>
                    </div>
                    <h4 className="font-bold text-foreground text-lg mb-1">
                      {location.Name}
                    </h4>
                    {location.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {location.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs bg-accent-orange/20 text-accent-orange px-2 py-0.5 rounded-full">
                        Tandem
                      </span>
                      {location.has_aff && (
                        <span className="text-xs bg-accent-blue/20 text-accent-blue px-2 py-0.5 rounded-full">
                          AFF
                        </span>
                      )}
                      {location.has_group_events && (
                        <span className="text-xs bg-accent-blue/20 text-accent-blue px-2 py-0.5 rounded-full">
                          Groups
                        </span>
                      )}
                    </div>
                    {location.coming_soon && (
                      <div className="mt-2">
                        <span className="text-xs bg-accent-blue text-white px-2 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
