import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../lib/store'
import { dashboardAPI } from '../lib/api'
import { DashboardData } from '../types'
import { FileText, Bell, Microscope, MapPin, Microscope as ScanIcon, Map } from 'lucide-react'

function StatCard({ label, value, color, icon: Icon, border }: { label: string; value: number; color: string; icon: any; border: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)' }

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ borderLeft: `4px solid ${border}`, transition: 'transform 0.1s' }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color }}>
          <Icon size={16} className="text-gray-700" />
        </div>
      </div>
      <p className="font-serif text-4xl font-bold text-gray-900">{value}</p>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.getData().then(r => { setData(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const isEmpty = !data || data.totalReports === 0

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening on your farm network</p>
      </div>

      {isEmpty ? (
        /* Empty state */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="mb-6 opacity-60">
            <circle cx="60" cy="60" r="50" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="2"/>
            <path d="M60 30 C45 50 35 75 60 90 C85 75 75 50 60 30Z" fill="#22C55E" opacity="0.6"/>
            <path d="M60 30 L60 90" stroke="#166534" strokeWidth="1.5" opacity="0.4"/>
            <path d="M60 55 Q75 50 80 60" stroke="#166534" strokeWidth="1.5" opacity="0.4" fill="none"/>
            <path d="M60 70 Q45 65 40 75" stroke="#166534" strokeWidth="1.5" opacity="0.4" fill="none"/>
          </svg>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Welcome to KrishiRakshak AI</h2>
          <p className="text-gray-500 max-w-md mb-8">You have not submitted any disease reports yet. Scan your first crop to get started and protect your harvest.</p>
          <div className="flex gap-4">
            <Link to="/detect" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
              <ScanIcon size={18} /> Scan Crop
            </Link>
            <Link to="/heatmap" className="flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-green-50 transition-colors">
              <Map size={18} /> View Heatmap
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Reports" value={data.totalReports} color="#F0FDF4" border="#22C55E" icon={FileText} />
            <StatCard label="Active Alerts" value={data.activeAlerts} color="#FEF9C3" border="#F59E0B" icon={Bell} />
            <StatCard label="Diseases Found" value={data.detectedDiseases} color="#FEF2F2" border="#EF4444" icon={Microscope} />
            <StatCard label="Locations" value={data.locations} color="#EFF6FF" border="#3B82F6" icon={MapPin} />
          </div>

          {/* Recent reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-serif font-semibold text-lg text-gray-900 mb-4">Recent Reports</h2>
              {data.recentReports.length === 0 ? (
                <p className="text-gray-400 text-sm">No reports yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentReports.slice(0, 5).map(r => (
                    <div key={r._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{r.diseaseName}</p>
                        <p className="text-xs text-gray-400">{r.cropName} · {new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.confidence < 0.6 ? 'bg-amber-100 text-amber-700' :
                        r.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                        r.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'}`}>
                        {r.confidence < 0.6 ? 'Uncertain' : r.riskLevel}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-serif font-semibold text-lg text-gray-900 mb-4">Recent Alerts</h2>
              {data.recentAlerts.length === 0 ? (
                <p className="text-gray-400 text-sm">No active alerts in your area.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentAlerts.slice(0, 5).map(a => (
                    <div key={a._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{a.diseaseName}</p>
                        <p className="text-xs text-gray-400">{a.affectedArea} · {a.cases} cases</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        a.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                        a.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'}`}>
                        {a.riskLevel}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}