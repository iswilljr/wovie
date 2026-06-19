import { useCallback, useState } from 'react'
import useSWR from 'swr'
import { CircleUserRound } from 'lucide-react'
import { actions } from 'astro:actions'
import type { MultiSearchResult } from 'tmdb-ts'
import { SignInForm } from '@/components/Auth/SignIn'
import { SignUpForm } from '@/components/Auth/SignUp'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { getImagePath, swrDefaultOptions } from '@/utils'

function AuthPosterPanel() {
  const { data, isLoading } = useSWR(
    'trendingAll',
    () => actions.trendingAll(),
    swrDefaultOptions
  )

  const results = (data?.data as MultiSearchResult[] | null) ?? []
  const posterPath = results.find(
    item =>
      (item.media_type === 'movie' || item.media_type === 'tv') &&
      'poster_path' in item &&
      item.poster_path
  )
  const poster =
    posterPath && 'poster_path' in posterPath ? posterPath.poster_path : null

  return (
    <div className='relative hidden min-h-[28rem] overflow-hidden sm:block'>
      {isLoading ? (
        <div className='absolute inset-0 animate-pulse bg-surface-overlay' />
      ) : poster ? (
        <>
          <img
            src={getImagePath(poster, 'w780')}
            alt=''
            className='absolute inset-0 h-full w-full object-cover object-top'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-surface-raised' />
          <div className='absolute inset-0 bg-gradient-to-t from-surface-raised/50 via-transparent to-black/20' />
        </>
      ) : (
        <div className='absolute inset-0 bg-gradient-to-br from-surface-overlay via-surface-raised to-surface'>
          <div className='absolute inset-0 bg-hero-vignette opacity-60' />
        </div>
      )}
    </div>
  )
}

export function AuthContent() {
  const [currentTab, setCurrentTab] = useState<'sign-in' | 'sign-up'>('sign-in')

  const onSignIn = useCallback(() => setCurrentTab('sign-in'), [])
  const onSignUp = useCallback(() => setCurrentTab('sign-up'), [])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'>
      <AuthPosterPanel />

      <div className='relative flex min-h-[28rem] flex-col justify-center px-6 py-10 sm:px-10 sm:py-12'>
        <div className='pointer-events-none absolute inset-0 bg-hero-vignette opacity-40' />

        <div className='relative'>
          {currentTab === 'sign-in' && <SignInForm onSignUp={onSignUp} />}
          {currentTab === 'sign-up' && <SignUpForm onSignIn={onSignIn} />}
        </div>
      </div>
    </div>
  )
}

export function AuthDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label='Log in'
          className='flex size-9 items-center justify-center rounded-xl border border-border-subtle bg-surface-overlay/60 text-zinc-400 transition-colors hover:border-accent/30 hover:text-white'
        >
          <CircleUserRound className='size-5' />
        </button>
      </DialogTrigger>
      <DialogContent className='max-w-3xl overflow-hidden rounded-2xl border-border-subtle bg-surface-raised p-0 shadow-glow sm:min-h-0'>
        <AuthContent />
      </DialogContent>
    </Dialog>
  )
}
