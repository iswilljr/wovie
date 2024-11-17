import { useCallback, useState } from 'react'
import { CircleUserRoundIcon } from 'lucide-react'
import { SignInForm } from '@/components/Auth/SignIn'
import { SignUpForm } from '@/components/Auth/SignUp'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export function AuthContent({
  initialTab = 'sign-in',
  isHtmlPage = false,
}: {
  initialTab?: 'sign-in' | 'sign-up'
  isHtmlPage?: boolean
}) {
  const [currentTab, setCurrentTab] = useState(initialTab)

  const onSignIn = useCallback(() => setCurrentTab('sign-in'), [])
  const onSignUp = useCallback(() => setCurrentTab('sign-up'), [])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2'>
      <div className='hidden max-h-[calc(100svh-5rem)] sm:flex'>
        <picture>
          <source srcSet='/auth/auth-1280x720.avif' type='image/avif' />
          <source srcSet='/auth/auth-1280x720.webp' type='image/webp' />
          <img
            src='/auth/auth-1280x720.jpg'
            alt='avatar'
            className='aspect-[499/806] h-auto w-full object-cover object-bottom opacity-80'
          />
        </picture>
      </div>

      <div className='relative h-full w-full px-8 py-16'>
        {currentTab === 'sign-in' && (
          <SignInForm onSignUp={onSignUp} isHtmlPage={isHtmlPage} />
        )}
        {currentTab === 'sign-up' && (
          <SignUpForm onSignIn={onSignIn} isHtmlPage={isHtmlPage} />
        )}
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
          className='rounded-full bg-transparent text-white'
        >
          <CircleUserRoundIcon className='!size-7' />
        </button>
      </DialogTrigger>
      <DialogContent className='max-w-3xl border-0 sm:min-h-0'>
        <AuthContent />
      </DialogContent>
    </Dialog>
  )
}
