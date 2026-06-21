import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { profileAPI } from '../lib/api'
import { useAuthStore } from '../lib/store'
import { User, FileText, Bell, Bookmark, Settings } from 'lucide-react'

export default function Profile() {
  const { user } = useAuthStore()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'reports' | 'alerts' | 'schemes'>('reports')

  useEffect(() => {
    profileAPI.get()
      .then(r => { setData(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="font-serif text-3xl font-bold text-gray-900">Profile</h1>

      {/* User info card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-serif font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
          <p className="text-xs text-gray-400 mt-1">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Today'}</p>
        </div>
        <button className="ml-auto flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors">
          <Settings size={16} /> Settings
        </button>
      </motion.div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Reports', value: data.reports?.length || 0, icon: FileText, color: '#F0FDF4', border: '#22C55E' },
            { label: 'Alerts', value: data.alerts?.length || 0, icon: Bell, color: '#FEF9C3', border: '#F59E0B' },
            { label: 'Saved Schemes', value: data.savedSchemes?.length || 0, icon: Bookmark, color: '#FFF7ED', border: '#F97316' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              style={{ borderLeft: `4px solid ${s.border}` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.color }}>
                <s.icon size={16} className="text-gray-600" />
              </div>
              <p className="font-serif text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: 'reports', label: 'My Reports', icon: FileText },
            { key: 'alerts', label: 'Alert History', icon: Bell },
            { key: 'schemes', label: 'Saved Schemes', icon: Bookmark },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                tab === t.key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !data || (tab === 'reports' && !data.reports?.length) ||
            (tab === 'alerts' && !data.alerts?.length) ||
            (tab === 'schemes' && !data.savedSchemes?.length) ? (
            <div className="text-center py-12 text-gray-400">
              <p className="font-serif text-lg">No {tab} yet</p>
              <p className="text-sm mt-1">Your {tab} will appear here</p>
            </div>
          ) : tab === 'reports' ? (
            <div className="space-y-3">
              {data.reports.map((r: any) => (
                <div key={r._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{r.diseaseName}</p>
                    <p className="text-xs text-gray-400">{r.cropName} · {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    r.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                    r.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {r.riskLevel}
                  </span>
                </div>
              ))}
            </div>
          ) : tab === 'alerts' ? (
            <div className="space-y-3">
              {data.alerts.map((a: any) => (
                <div key={a._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{a.diseaseName}</p>
                    <p className="text-xs text-gray-400">{a.affectedArea} · {a.cases} cases</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    a.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                    a.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {a.riskLevel}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {data.savedSchemes.map((s: any) => (
                <div key={s._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{s.schemeName}</p>
                    <p className="text-xs text-gray-400">Saved on {new Date(s.savedAt).toLocaleDateString()}</p>
                  </div>
                  <Bookmark size={16} className="text-orange-400" fill="currentColor" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
