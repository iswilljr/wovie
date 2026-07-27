import * as React from 'react'

import { cn } from '@/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary-950 placeholder:text-primary-500 focus-visible:ring-1 focus-visible:ring-primary-950 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-zinc-700 dark:file:text-primary-50 dark:placeholder:text-zinc-500 dark:focus-visible:ring-primary-500',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
