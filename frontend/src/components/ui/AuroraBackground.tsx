import { useEffect, useRef, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AuroraBackgroundProps {
  children: ReactNode
  className?: string
}

export default function AuroraBackground({ children, className = '' }: AuroraBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const spot = spotRef.current
    if (!el || !spot) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      spot.style.transform = `translate(${x - 200}px, ${y - 200}px)`
    }

    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Static aurora layers */}
      <div className="aurora absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(34,197,94,0.10) 0%, rgba(163,230,53,0.06) 50%, transparent 100%)' }} />
      <div className="aurora absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 60%, rgba(22,101,52,0.07) 0%, transparent 60%)', animationDelay: '-4s' }} />
      <div className="aurora absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 80% 30%, rgba(163,230,53,0.06) 0%, transparent 60%)', animationDelay: '-8s' }} />

      {/* Leaf vein SVG texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <pattern id="leafvein" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M40 5 C25 25 15 55 40 75 C65 55 55 25 40 5Z" fill="#166534"/>
          <line x1="40" y1="5" x2="40" y2="75" stroke="#166534" strokeWidth="0.8"/>
          <path d="M40 25 Q55 22 58 35" stroke="#166534" strokeWidth="0.5" fill="none"/>
          <path d="M40 45 Q25 42 22 55" stroke="#166534" strokeWidth="0.5" fill="none"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#leafvein)"/>
      </svg>

      {/* Mouse spotlight */}
      <div ref={spotRef}
        className="absolute pointer-events-none z-0"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(163,230,53,0.09) 0%, transparent 70%)',
          borderRadius: '50%',
          transition: 'transform 0.1s ease-out',
        }} />

      {/* AI network nodes */}
      {[
        { x: '8%', y: '25%', size: 3, color: '#A3E635', delay: 0 },
        { x: '15%', y: '55%', size: 2, color: '#22C55E', delay: 1 },
        { x: '5%', y: '75%', size: 4, color: '#166534', delay: 2 },
        { x: '88%', y: '20%', size: 3, color: '#A3E635', delay: 0.5 },
        { x: '93%', y: '50%', size: 2, color: '#22C55E', delay: 1.5 },
        { x: '85%', y: '70%', size: 4, color: '#166534', delay: 2.5 },
        { x: '50%', y: '10%', size: 2, color: '#22C55E', delay: 1 },
        { x: '25%', y: '15%', size: 3, color: '#A3E635', delay: 0.8 },
      ].map((node, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none z-0"
          style={{ left: node.x, top: node.y, width: node.size * 2, height: node.size * 2, background: node.color, opacity: 0.5 }}
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
        />
      ))}

      {/* Node connection lines SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
        <line x1="8%" y1="25%" x2="15%" y2="55%" stroke="#22C55E" strokeWidth="0.5"/>
        <line x1="15%" y1="55%" x2="5%" y2="75%" stroke="#22C55E" strokeWidth="0.5"/>
        <line x1="88%" y1="20%" x2="93%" y2="50%" stroke="#22C55E" strokeWidth="0.5"/>
        <line x1="93%" y1="50%" x2="85%" y2="70%" stroke="#22C55E" strokeWidth="0.5"/>
        <line x1="25%" y1="15%" x2="50%" y2="10%" stroke="#A3E635" strokeWidth="0.5"/>
      </svg>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
