import { z } from 'astro/zod'
import { useState } from 'react'
import { client } from '@/utils/auth/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils'
import { Spinner } from '../Loader'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

const inputClassName =
  'mt-2 h-10 rounded-xl border-border-subtle bg-surface-overlay/60 px-3 text-zinc-200 shadow-none placeholder:text-zinc-500 transition-colors focus-visible:border-accent/30 focus-visible:ring-1 focus-visible:ring-accent/20 focus-visible:ring-offset-0'

export function SignUpForm({ onSignIn }: { onSignIn: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isLoading) return
    try {
      e.preventDefault()
      setIsLoading(true)
      setError(null)
      const data = new FormData(e.currentTarget)
      const values = schema.parse(Object.fromEntries(data))
      const res = await client.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      })

      if (res.error) {
        setIsLoading(false)
        setError(res.error.message ?? 'Something went wrong, please try again.')
        return
      }

      window.location.reload()
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      setError('Something went wrong, please try again.')
    }
  }

  return (
    <div className='mx-auto w-full max-w-sm'>
      <div className='text-center'>
        <span className='mx-auto flex size-10 items-center justify-center rounded-xl bg-accent text-base font-bold text-accent-foreground shadow-glow'>
          W
        </span>
        <h2 className='mt-4 text-2xl font-semibold tracking-tight text-white'>
          Create your account
        </h2>
        <p className='mt-1.5 text-sm text-zinc-500'>
          Save your watchlist and pick up where you left off
        </p>
      </div>

      <form
        method='POST'
        action='/api/_auth/sign-in'
        className='mt-8 space-y-4'
        onSubmit={handleSubmit}
      >
        <div>
          <Label htmlFor='name' className='text-zinc-400'>
            Name
          </Label>
          <Input
            min={2}
            required
            id='name'
            name='name'
            type='text'
            autoComplete='name'
            className={inputClassName}
            placeholder='John Doe'
          />
        </div>
        <div>
          <Label htmlFor='email' className='text-zinc-400'>
            Email address
          </Label>
          <Input
            required
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            className={inputClassName}
            placeholder='john@example.com'
          />
        </div>
        <div>
          <Label htmlFor='password' className='text-zinc-400'>
            Password
          </Label>
          <Input
            min={8}
            required
            id='password'
            name='password'
            type='password'
            autoComplete='new-password'
            className={inputClassName}
            placeholder='••••••••'
          />
        </div>
        <Button
          disabled={isLoading}
          type='submit'
          className='mt-2 flex h-10 w-full items-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-glow transition-all hover:bg-accent-bright active:scale-[0.98]'
        >
          {isLoading ? <Spinner className='[--color:#0a0a0a]' /> : 'Sign up'}
        </Button>
        {error && (
          <p className='rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400'>
            {error}
          </p>
        )}
      </form>

      <p
        className={cn(
          'mt-6 text-center text-sm text-zinc-500',
          error && 'mt-4'
        )}
      >
        Already have an account?{' '}
        <button
          type='button'
          onClick={onSignIn}
          className='font-medium text-accent transition-colors hover:text-accent-bright'
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
