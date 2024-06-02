import { useState, useEffect } from 'preact/hooks'

export function useDebouncedState<T>(initialValue: T, delay = 500) {
  const [state, setState] = useState(initialValue)
  const [debouncedState, setDebouncedState] = useState(initialValue)

  useEffect(() => {
    setState(state)
    const handler = setTimeout(() => {
      setDebouncedState(state)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [state, delay])

  return [debouncedState, setState] as const
}
