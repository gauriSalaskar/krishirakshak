import { useState, useEffect } from 'react'

interface Location {
  lat: number
  lon: number
  city?: string
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location>({ lat: 19.2403, lon: 73.1305, city: 'Kalyan, MH' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) { setLoading(false); return }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
          const data = await res.json()
          const city = data.address?.city || data.address?.town || data.address?.village || 'Your Location'
          const state = data.address?.state || ''
          setLocation({ lat, lon, city: `${city}, ${state}` })
        } catch {
          setLocation({ lat, lon })
        }
        setLoading(false)
      },
      () => setLoading(false),
      { timeout: 5000 }
    )
  }, [])

  return { location, loading }
}
