// Adapted from https://usehooks-ts.com/react-hook/use-on-click-outside

import type { RefObject } from 'preact'
import { useEventListener } from './use-event-listener'

type EventType =
  | 'mousedown'
  | 'mouseup'
  | 'touchstart'
  | 'touchend'
  | 'focusin'
  | 'focusout'

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: EventType = 'mousedown',
  eventListenerOptions: AddEventListenerOptions = {}
): void {
  useEventListener(
    eventType,
    event => {
      const target = event.target as Node

      // Do nothing if the target is not connected element with document
      if (!target || !target.isConnected) {
        return
      }

      const isOutside = ref.current && !ref.current.contains(target)

      if (isOutside) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        handler(event as any)
      }
    },
    undefined,
    eventListenerOptions
  )
}
