import { useRef } from 'react'

export function useMagneticTilt(maxDeg = 12) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    el.style.transform = `perspective(800px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg) scale(1.02) translateZ(10px)`
    el.style.boxShadow = `0 20px 40px rgba(34,197,94,0.18), 0 0 0 1px rgba(34,197,94,0.08)`
    el.style.transition = 'box-shadow 0.2s'
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1) translateZ(0)'
    el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
    el.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s'
  }

  return { ref, onMouseMove, onMouseLeave }
}
