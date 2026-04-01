import { useState, useCallback } from 'react'

const KEY = 'chemistry11_progress'

const load = () => {
    try { return new Set(JSON.parse(localStorage.getItem(KEY)) || []) }
    catch { return new Set() }
}
const save = (set) => {
    localStorage.setItem(KEY, JSON.stringify([...set]))
}

export function useProgress() {
    const [done, setDone] = useState(load)

    const toggle = useCallback((key) => {
        setDone(prev => {
            const next = new Set(prev)
            next.has(key) ? next.delete(key) : next.add(key)
            save(next)
            return next
        })
    }, [])

    const chapterDone = useCallback((chId, count) => {
        let n = 0
        for (let i = 0; i < count; i++) if (done.has(`${chId}-${i}`)) n++
        return n
    }, [done])

    const reset = useCallback(() => {
        localStorage.removeItem(KEY)
        setDone(new Set())
    }, [])

    return { done, toggle, chapterDone, reset }
}