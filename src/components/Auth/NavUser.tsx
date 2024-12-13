import { LogOutIcon } from 'lucide-react'
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

export function NavUser({ isBot = false }) {
  const { user, isLoading, isAuthenticated } = useSession({ isBot })

  if (isLoading || !isAuthenticated) {
    return <AuthDialog />
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='flex size-7 flex-1 items-center justify-center rounded bg-white text-left text-sm leading-tight text-black'>
          <span className='truncate font-semibold'>
            {user?.name.slice(0, 1)}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className='w-56 max-w-40 overflow-hidden rounded-lg p-0'
        align='end'
        sideOffset={8}
      >
        <div className='p-2 font-normal'>
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>{user?.name}</span>
              <span className='truncate text-sm text-zinc-400'>
                {user?.email}
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <div className='p-1'>
          <button
            className='flex w-full items-center justify-between gap-2 rounded-lg p-2 text-left text-sm text-zinc-400 hover:bg-zinc-800'
            onClick={handleLogout}
          >
            Log out
            <LogOutIcon className='size-4' />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
