import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        background: scrolled ? 'rgba(250,249,246,0.85)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(34,197,94,0.15)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(22,101,52,0.08)' : 'none',
      }}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between transition-all duration-300"
    >
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Leaf size={16} className="text-white" />
        </div>
        <span className="font-serif font-semibold text-primary text-lg">KrishiRakshak AI</span>
      </Link>

      <div className="flex items-center gap-8">
        <a href="#features" className="text-sm text-gray-600 hover:text-primary transition-colors">Features</a>
        <a href="#howitworks" className="text-sm text-gray-600 hover:text-primary transition-colors">How It Works</a>
        <Link to="/login" className="text-sm text-gray-600 hover:text-primary transition-colors">Login</Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Register
        </Link>
      </div>
    </motion.nav>
  )
}
