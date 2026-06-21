import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './lib/store'
import CustomCursor from './components/cursor/CustomCursor'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Detect from './pages/Detect'
import Heatmap from './pages/Heatmap'
import Alerts from './pages/Alerts'
import Community from './pages/Community'
import Schemes from './pages/Schemes'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />
}

export default function App() {
  const { loadFromStorage } = useAuthStore()

  useEffect(() => {
    loadFromStorage()
  }, [])

  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/community" element={<Community />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
