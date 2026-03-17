'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, X, Search } from 'lucide-react'

interface LocationPickerProps {
  onClose: () => void
  onSelect: (location: string) => void
  currentLocation: string
}

declare global {
  interface Window {
    google: typeof google
    initGoogleMaps: () => void
  }
}

export default function LocationPicker({ onClose, onSelect, currentLocation }: LocationPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [detecting, setDetecting] = useState(false)
  const [mapsLoaded, setMapsLoaded] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    // Load Google Maps if not already loaded
    if (window.google?.maps?.places) {
      setMapsLoaded(true)
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) return

    window.initGoogleMaps = () => setMapsLoaded(true)

    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script')
      script.id = 'google-maps-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (!mapsLoaded || !inputRef.current) return

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'],
      fields: ['formatted_address', 'name', 'address_components'],
    })

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current!.getPlace()
      if (!place) return

      // Extract city + state/country
      const components = place.address_components || []
      const city = components.find(c => c.types.includes('locality'))?.short_name
        || components.find(c => c.types.includes('sublocality'))?.short_name
        || place.name
      const state = components.find(c => c.types.includes('administrative_area_level_1'))?.short_name
      const country = components.find(c => c.types.includes('country'))?.short_name

      const label = city && state
        ? `${city}, ${state}`
        : city && country
        ? `${city}, ${country}`
        : place.name || place.formatted_address || ''

      if (label) {
        onSelect(label)
        onClose()
      }
    })

    inputRef.current.focus()
  }, [mapsLoaded, onSelect, onClose])

  function detectLocation() {
    if (!navigator.geolocation) return
    setDetecting(true)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county
          const state = data.address?.state_code || data.address?.state
          const label = city && state ? `${city}, ${state}` : city || 'Unknown location'
          onSelect(label)
          onClose()
        } catch {
          setDetecting(false)
        }
      },
      () => setDetecting(false),
      { timeout: 8000 }
    )
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed z-50 top-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-white rounded-2xl shadow-2xl border border-cream-200 overflow-hidden">
        <div className="px-4 py-4 border-b border-cream-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-800 font-semibold">
            <MapPin size={16} className="text-velour-500" />
            Change location
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Current */}
          <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">Current</p>
          <div className="flex items-center gap-2 px-3 py-2 bg-cream-50 rounded-xl border border-cream-200">
            <MapPin size={14} className="text-velour-500 shrink-0" />
            <span className="text-sm text-stone-700 font-medium">{currentLocation}</span>
          </div>

          {/* Search */}
          <p className="text-xs text-stone-400 uppercase tracking-wide font-medium pt-1">Search city</p>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={apiKey ? 'Type a city…' : 'Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable search'}
              disabled={!apiKey}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cream-200 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-velour-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Detect */}
          <button
            onClick={detectLocation}
            disabled={detecting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-cream-200 hover:bg-cream-50 transition-colors text-sm text-stone-700 font-medium disabled:opacity-60"
          >
            <Navigation size={15} className={`text-velour-500 ${detecting ? 'animate-pulse' : ''}`} />
            {detecting ? 'Detecting…' : 'Use my current location'}
          </button>

          {!apiKey && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              Add <code className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to <code className="font-mono">.env.local</code> to enable city search.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
