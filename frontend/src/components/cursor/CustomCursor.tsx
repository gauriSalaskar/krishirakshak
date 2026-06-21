import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }

    const click = (e: MouseEvent) => {
      // Ripple
      const ripple = document.createElement('div')
      ripple.className = 'ripple-effect'
      ripple.style.width = '80px'
      ripple.style.height = '80px'
      ripple.style.left = `${e.clientX - 40}px`
      ripple.style.top = `${e.clientY - 40}px`
      document.body.appendChild(ripple)
      setTimeout(() => ripple.remove(), 500)
    }

    // Particle trail
    let lastParticle = 0
    const particleColors = ['#166534', '#22C55E', '#A3E635']
    const trail = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastParticle < 80) return
      lastParticle = now
      const p = document.createElement('div')
      p.className = 'particle'
      const size = Math.random() * 4 + 3
      p.style.width = `${size}px`
      p.style.height = `${size}px`
      p.style.left = `${e.clientX}px`
      p.style.top = `${e.clientY}px`
      p.style.background = particleColors[Math.floor(Math.random() * particleColors.length)]
      document.body.appendChild(p)
      setTimeout(() => p.remove(), 600)
    }

    // Hover detection
    const onEnter = () => setIsHovering(true)
    const onLeave = () => setIsHovering(false)
    const interactives = document.querySelectorAll('a, button, [data-hover]')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    window.addEventListener('mousemove', move)
    window.addEventListener('mousemove', trail)
    window.addEventListener('click', click)

    // Lerp ring
    let raf: number
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.08
      ring.current.y += (pos.current.y - ring.current.y) * 0.08
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousemove', trail)
      window.removeEventListener('click', click)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: 8, height: 8,
          borderRadius: '50%', background: '#166534', pointerEvents: 'none',
          zIndex: 99999, transition: 'transform 0.05s linear',
          transform: isHovering ? 'scale(0)' : 'scale(1)',
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          borderRadius: '50%',
          border: '1.5px solid #22C55E',
          background: isHovering ? 'rgba(34,197,94,0.15)' : 'transparent',
          pointerEvents: 'none', zIndex: 99998,
          transition: 'width 0.2s, height 0.2s, background 0.2s',
        }}
      />
    </>
  )
}
