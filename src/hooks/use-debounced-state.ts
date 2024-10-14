import { useState, useEffect } from 'preact/hooks'

const noop = <T>(_q: T) => {}

export function useDebouncedState<T>(
  initialValue: T | (() => T),
  { delay = 500, callback = noop<T> } = {}
) {
  const [state, setState] = useState(initialValue)
  const [debouncedState, setDebouncedState] = useState(initialValue)

  useEffect(() => {
    setState(state)
    const handler = setTimeout(() => {
      setDebouncedState(state)
      callback(state)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [state, delay])

  return [debouncedState, setState] as const
}
