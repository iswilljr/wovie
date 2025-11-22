import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme='light'
      className='toaster group'
      position='top-right'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-primary-500 group-[.toaster]:text-white group-[.toaster]:border-primary-500/50 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-md group-[.toaster]:rounded-xl',
          description: 'group-[.toast]:text-white/80',
          actionButton:
            'group-[.toast]:bg-primary-500 group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-black/10 group-[.toast]:text-white',
          success: 'group-[.toaster]:!border-primary-500',
          error:
            'group-[.toaster]:!border-red-500 group-[.toaster]:!bg-red-500',
          info: 'group-[.toaster]:!border-blue-500',
          warning: 'group-[.toaster]:!border-yellow-500',
        },
      }}
      {...props}
    />
  )
}
