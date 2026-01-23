import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLocations } from '@/hooks/useLocations'
import { MapPin, Loader2 } from 'lucide-react'

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

export default function LocationsMapContent() {
  const { data: locations, isLoading } = useLocations()

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
      </div>
    )
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">No locations available</p>
      </div>
    )
  }

  // Get coordinates for locations
  const mappedLocations = locations
    .filter(loc => loc.City && cityCoordinates[loc.City])
    .map(loc => ({
      ...loc,
      coords: cityCoordinates[loc.City!] as [number, number]
    }))

  if (mappedLocations.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">No mapped locations available</p>
      </div>
    )
  }

  // Calculate center point
  const centerLat = mappedLocations.reduce((sum, loc) => sum + loc.coords[0], 0) / mappedLocations.length
  const centerLng = mappedLocations.reduce((sum, loc) => sum + loc.coords[1], 0) / mappedLocations.length

  return (
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
                <MapPin className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-gray-500">
                  {location.City}, {location.country}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-1">
                {location.Name}
              </h4>
              {location.description && (
                <p className="text-sm text-gray-600 mb-3">
                  {location.description}
                </p>
              )}
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                  Tandem
                </span>
                {location.has_aff && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    AFF
                  </span>
                )}
                {location.has_group_events && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    Groups
                  </span>
                )}
              </div>
              {location.coming_soon && (
                <div className="mt-2">
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
