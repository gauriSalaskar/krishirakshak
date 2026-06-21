import { useState } from 'react'
import { useAuthStore } from '../lib/store'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Shield, Globe, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [alertRadius, setAlertRadius] = useState('5')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold text-gray-900">Settings</h1>

      {[
        {
          icon: Bell, title: 'Notifications', desc: 'Manage alert preferences',
          content: (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Outbreak Alerts</p>
                  <p className="text-xs text-gray-400">Get notified when disease outbreaks are detected nearby</p>
                </div>
                <button onClick={() => setNotifications(!notifications)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Alert Radius</p>
                <select value={alertRadius} onChange={e => setAlertRadius(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm bg-gray-50">
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                </select>
              </div>
            </div>
          )
        },
        {
          icon: Shield, title: 'Account Security', desc: 'Password and authentication',
          content: (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input value={user?.email || ''} disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-100 text-sm bg-gray-50 text-gray-400" />
              </div>
              <button className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors">
                Change Password
              </button>
            </div>
          )
        },
        {
          icon: Globe, title: 'Language & Region', desc: 'Localization preferences',
          content: (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm bg-gray-50">
                <option>English</option>
                <option>हिंदी (Hindi)</option>
                <option>मराठी (Marathi)</option>
              </select>
            </div>
          )
        },
      ].map(section => (
        <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <section.icon size={18} className="text-primary" />
            </div>
            <div>
              <p className="font-serif font-semibold text-gray-900">{section.title}</p>
              <p className="text-xs text-gray-400">{section.desc}</p>
            </div>
          </div>
          {section.content}
        </motion.div>
      ))}

      <div className="flex gap-3">
        <button onClick={handleSave}
          className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
        <button onClick={() => { logout(); navigate('/') }}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors border border-red-100">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}
