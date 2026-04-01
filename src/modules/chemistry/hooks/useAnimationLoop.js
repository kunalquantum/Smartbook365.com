import { useEffect, useRef } from 'react'

export function useAnimationLoop(callback, deps = []) {
    const rafRef = useRef(null)
    const lastRef = useRef(null)
    const cbRef = useRef(callback)
    cbRef.current = callback

    useEffect(() => {
        const step = (ts) => {
            if (!lastRef.current) lastRef.current = ts
            const dt = Math.min((ts - lastRef.current) / 1000, 0.05)  // cap at 50ms
            lastRef.current = ts
            cbRef.current(dt, ts)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => {
            cancelAnimationFrame(rafRef.current)
            lastRef.current = null
        }
    }, deps)
}