import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../lib/store'
import { Leaf, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#FAF9F6' }}>
      {/* Leaf pattern bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <pattern id="leafbg" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 5 C20 20 10 40 30 55 C50 40 40 20 30 5Z" fill="#166534"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#leafbg)"/>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Leaf size={22} className="text-white" />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-center text-gray-500 text-sm mb-8">Sign in to KrishiRakshak AI</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="farmer@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary text-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  required placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary text-sm bg-gray-50"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
