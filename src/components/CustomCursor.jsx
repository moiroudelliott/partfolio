import { useState, useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let rx = mx, ry = my
    let raf

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
      setHover(!!(e.target.closest?.('[data-cursor="hover"], a, button, .hoverable')))
    }
    const tick = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener('mousemove', onMove)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove) }
  }, [])

  return (
    <>
      <div ref={ringRef} className={'cursor-trail' + (hover ? ' hovering' : '')} />
      <div ref={dotRef}  className={'cursor-dot'   + (hover ? ' hovering' : '')} />
    </>
  )
}
