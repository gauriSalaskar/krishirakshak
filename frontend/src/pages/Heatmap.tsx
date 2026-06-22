import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { reportsAPI } from '../lib/api'
import { Report } from '../types'
import { Map, Globe } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

const riskColors: Record<string, string> = { High: '#EF4444', Medium: '#F59E0B', Low: '#22C55E' }

export default function Heatmap() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'map' | 'globe'>('map')

  useEffect(() => {
    reportsAPI.getHeatmap()
      .then(r => { setReports(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Disease Heatmap</h1>
          <p className="text-gray-500 mt-1">Real-time outbreak visualization across India</p>
        </div>
        <div className="flex bg-white rounded-xl border border-gray-200 p-1 gap-1">
          <button onClick={() => setView('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'map' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}>
            <Map size={16} /> Flat Map
          </button>
          <button onClick={() => setView('globe')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'globe' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}>
            <Globe size={16} /> 3D Globe
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 bg-white rounded-xl px-5 py-3 border border-gray-100 shadow-sm w-fit">
        {Object.entries(riskColors).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: v }} />
            <span className="text-sm text-gray-600">{k} Risk</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-gray-100">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border border-gray-100 text-center">
          <svg width="80" height="80" viewBox="0 0 80 80" className="mb-4 opacity-40">
            <circle cx="40" cy="40" r="35" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="2"/>
            <path d="M20 40 Q40 20 60 40 Q40 60 20 40Z" fill="#22C55E" opacity="0.5"/>
          </svg>
          <p className="font-serif text-xl font-semibold text-gray-400 mb-2">No reports on map yet</p>
          <p className="text-gray-300 text-sm">Submit disease reports to see them appear here</p>
        </motion.div>
      ) : view === 'map' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ height: '600px' }}>
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports.map(r => (
              <CircleMarker key={r._id}
                center={[r.latitude, r.longitude]}
                radius={12}
                pathOptions={{
                  color: riskColors[r.riskLevel] || '#22C55E',
                  fillColor: riskColors[r.riskLevel] || '#22C55E',
                  fillOpacity: 0.5,
                  weight: 2,
                }}>
                <Popup>
                  <div className="p-1">
                    <p className="font-semibold text-gray-900">{r.diseaseName}</p>
                    <p className="text-sm text-gray-500">{r.cropName}</p>
                    <p className="text-sm text-gray-500">Confidence: {(r.confidence * 100).toFixed(0)}%</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                      r.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {r.riskLevel} Risk
                    </span>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-900 flex items-center justify-center"
          style={{ height: '600px' }}>
          <GlobeView reports={reports} />
        </motion.div>
      )}
    </div>
  )
}

function GlobeView({ reports }: { reports: Report[] }) {
  const [GlobeComponent, setGlobeComponent] = useState<any>(null)

  useEffect(() => {
    import('react-globe.gl').then(m => setGlobeComponent(() => m.default))
  }, [])

  const points = reports
    .filter(r => r.latitude && r.longitude && Math.abs(r.latitude) > 0.01 && Math.abs(r.longitude) > 0.01)
    .map(r => ({
      lat: r.latitude, lng: r.longitude,
      size: r.riskLevel === 'High' ? 0.8 : r.riskLevel === 'Medium' ? 0.5 : 0.3,
      color: riskColors[r.riskLevel] || '#22C55E',
      label: `${r.diseaseName} (${r.cropName})`,
    }))

  if (!GlobeComponent) return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (points.length === 0) return (
    <div className="flex flex-col items-center justify-center text-white opacity-50 gap-3">
      <Globe size={48} />
      <p>No location data to display on globe</p>
    </div>
  )

  return (
    <GlobeComponent
      width={800} height={580}
      globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
      pointsData={points}
      pointLat="lat" pointLng="lng"
      pointColor="color" pointAltitude="size"
      pointRadius={0.5} pointLabel="label"
      atmosphereColor="#22C55E"
      atmosphereAltitude={0.15}
      backgroundColor="rgba(15,26,15,1)"
    />
  )
}