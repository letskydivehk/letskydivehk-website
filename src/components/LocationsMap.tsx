'use client'

import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

const MapContent = lazy(() => import('./LocationsMapContent'))

export function LocationsMap() {
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
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
            </div>
          }>
            <MapContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
