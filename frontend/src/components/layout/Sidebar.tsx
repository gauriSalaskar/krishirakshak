import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../lib/store'
import {
  LayoutDashboard, Microscope, Map, Bell, Users, BookOpen, User, Settings, LogOut, Leaf
} from 'lucide-react'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/detect', icon: Microscope, label: 'Detect Disease' },
  { to: '/heatmap', icon: Map, label: 'Heatmap' },
  { to: '/alerts', icon: Bell, label: 'Outbreak Alerts' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/schemes', icon: BookOpen, label: 'Kisan Yojana Hub' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside style={{ background: '#0F1A0F' }} className="w-64 min-h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Leaf size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm font-serif">KrishiRakshak</p>
            <p className="text-xs" style={{ color: '#A3E635' }}>AI Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name || 'Farmer'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
