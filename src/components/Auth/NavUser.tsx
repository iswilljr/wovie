import { LogOut } from 'lucide-react'
import { useSession } from '@/hooks/use-session'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { AuthDialog } from '@/components/Auth/Auth'
import { client } from '@/utils/auth/react'

async function handleLogout() {
  await client.signOut()
  window.location.reload()
}

export function NavUser() {
  const { user, isLoading, isAuthenticated } = useSession()

  if (isLoading || !isAuthenticated) {
    return <AuthDialog />
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='flex size-9 items-center justify-center rounded-xl border border-border-subtle bg-surface-overlay/60 text-sm font-bold text-zinc-200 transition-colors hover:text-white active:scale-95'>
          {user?.name.slice(0, 1)}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className='w-56 overflow-hidden rounded-xl border-border-subtle bg-surface-raised p-0'
        align='end'
        sideOffset={8}
      >
        <div className='p-3'>
          <p className='truncate text-sm font-medium text-white'>
            {user?.name}
          </p>
          <p className='truncate text-xs text-zinc-500'>{user?.email}</p>
        </div>
        <Separator className='bg-border-subtle' />
        <div className='p-1'>
          <button
            className='flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white'
            onClick={handleLogout}
          >
            Log out
            <LogOut className='size-4' />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
