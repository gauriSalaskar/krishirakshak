import { useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ✦◆▲◉⬡'

export function useScrambleText(text: string) {
  const ref = useRef<HTMLSpanElement>(null)
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)

  const onHover = () => {
    const el = ref.current
    if (!el) return
    if (interval.current) clearInterval(interval.current)
    let iter = 0
    interval.current = setInterval(() => {
      el.innerText = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i < iter) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')
      el.style.color = '#22C55E'
      iter += 0.6
      if (iter >= text.length) {
        el.innerText = text
        el.style.color = ''
        if (interval.current) clearInterval(interval.current)
      }
    }, 30)
  }

  const onLeave = () => {
    if (interval.current) clearInterval(interval.current)
    if (ref.current) {
      ref.current.innerText = text
      ref.current.style.color = ''
    }
  }

  return { ref, onHover, onLeave }
}
