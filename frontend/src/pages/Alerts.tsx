import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { alertsAPI } from '../lib/api'
import { Alert } from '../types'
import { Bell, MapPin, Users, Calendar } from 'lucide-react'
import MagneticCard from '../components/ui/MagneticCard'

const riskConfig = {
  High: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', dot: '#EF4444', badge: 'bg-red-100 text-red-700' },
  Medium: { bg: '#FEF9C3', text: '#854F0B', border: '#FDE68A', dot: '#F59E0B', badge: 'bg-yellow-100 text-yellow-700' },
  Low: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', dot: '#22C55E', badge: 'bg-green-100 text-green-700' },
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All')

  useEffect(() => {
    alertsAPI.getAll()
      .then(r => { setAlerts(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? alerts : alerts.filter(a => a.riskLevel === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Outbreak Alerts</h1>
        <p className="text-gray-500 mt-1">Auto-generated alerts when disease clusters are detected</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['All', 'High', 'Medium', 'Low'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              filter === f ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100">
          <svg width="80" height="80" viewBox="0 0 80 80" className="mb-4 opacity-40">
            <circle cx="40" cy="40" r="35" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="2"/>
            <path d="M40 20 L40 45 M40 52 L40 56" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p className="font-serif text-xl font-semibold text-gray-400 mb-2">No outbreak alerts detected</p>
          <p className="text-gray-300 text-sm max-w-sm">
            Alerts are generated when 10+ same-disease reports appear within 5km in 7 days
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((alert, i) => {
            const cfg = riskConfig[alert.riskLevel]
            return (
              <motion.div key={alert._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <MagneticCard
                  className="bg-white rounded-2xl p-6 shadow-sm border"
                  style={{ borderColor: cfg.border, borderLeftWidth: 4, borderLeftColor: cfg.dot }}
                  glowColor={`${cfg.dot}33`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cfg.bg }}>
                      <Bell size={18} style={{ color: cfg.text }} />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-gray-900">{alert.diseaseName}</h3>
                      <p className="text-xs text-gray-400">Outbreak Alert</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
                    {alert.riskLevel} Risk
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} className="text-primary" />
                    <span className="truncate">{alert.affectedArea}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={14} className="text-primary" />
                    <span>{alert.cases} cases</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} className="text-primary" />
                    <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-primary">📍</span>
                    <span>{alert.radius}km radius</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="pulse-marker w-2.5 h-2.5 rounded-full" style={{ background: cfg.dot }} />
                    <span className="text-xs text-gray-400">Active — monitoring in progress</span>
                  </div>
                </div>
                </MagneticCard>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
