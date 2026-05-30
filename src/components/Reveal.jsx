import { useEffect, useRef } from 'react'

export default function Reveal({ children, delay = 0, from = 'bottom', as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el) } },
      { threshold: 0.08 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${from}`}
      style={{ '--rev-delay': `${delay}s` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
