import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Leaf pattern bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <pattern id="leafbg404" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 5 C20 20 10 40 30 55 C50 40 40 20 30 5Z" fill="#166534"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#leafbg404)"/>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-8"
      >
        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="font-serif text-[160px] font-bold leading-none select-none"
            style={{ color: '#F0FDF4', WebkitTextStroke: '2px #BBF7D0' }}>
            404
          </p>
          {/* Leaf overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <path d="M60 10 C35 35 20 70 60 100 C100 70 85 35 60 10Z" fill="#22C55E" opacity="0.3"/>
              <path d="M60 10 C35 35 20 70 60 100 C100 70 85 35 60 10Z" fill="none" stroke="#166534" strokeWidth="2" opacity="0.5"/>
              <line x1="60" y1="10" x2="60" y2="100" stroke="#166534" strokeWidth="1.5" opacity="0.3"/>
              <path d="M60 40 Q80 35 85 50" stroke="#166534" strokeWidth="1.5" fill="none" opacity="0.3"/>
              <path d="M60 60 Q40 55 35 70" stroke="#166534" strokeWidth="1.5" fill="none" opacity="0.3"/>
            </svg>
          </div>
        </div>

        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
          Looks like this page wandered off into the fields. Let's get you back to familiar ground.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 hover:-translate-y-0.5">
            <Home size={18} /> Go Home
          </Link>
          <button onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:border-primary hover:text-primary transition-all">
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}
