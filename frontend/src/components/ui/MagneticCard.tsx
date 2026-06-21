import { useRef, ReactNode } from 'react'

interface MagneticCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  maxDeg?: number
  glowColor?: string
}

export default function MagneticCard({
  children,
  className = '',
  style = {},
  maxDeg = 10,
  glowColor = 'rgba(34,197,94,0.15)',
}: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    el.style.transform = `perspective(800px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg) scale(1.02) translateZ(8px)`
    el.style.boxShadow = `0 20px 40px ${glowColor}, 0 4px 12px rgba(0,0,0,0.08)`
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1) translateZ(0)'
    el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
    el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s'
  }

  const onMouseEnter = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'box-shadow 0.2s'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      className={className}
      style={{ ...style, willChange: 'transform', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}
