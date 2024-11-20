import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils'
import { client } from '@/utils/auth/react'
import { z } from 'astro/zod'
import { useState } from 'react'
import { Spinner } from '../Loader'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function SignInForm({ onSignUp }: { onSignUp: () => void }) {
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
      const res = await client.signIn.email({
        email: values.email,
        password: values.password,
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
    <div className='flex min-h-full flex-col justify-center'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <img
          className='mx-auto h-10 w-auto'
          src='/favicon.png'
          alt='Your Company'
        />
        <h2 className='mt-1 text-balance text-center text-2xl/9 font-bold tracking-tight'>
          Create your account
        </h2>
      </div>

      <div className='mt-6 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form
          method='POST'
          action='/api/_auth/sign-up'
          className='space-y-4'
          onSubmit={handleSubmit}
        >
          <div>
            <Label htmlFor='email'>Email address</Label>
            <Input
              required
              id='email'
              name='email'
              type='email'
              className='mt-2'
              placeholder='john@example.com'
            />
          </div>
          <div>
            <Label htmlFor='password'>Password</Label>
            <Input
              min={8}
              required
              id='password'
              name='password'
              type='password'
              className='mt-2'
              placeholder='••••••••'
            />
          </div>
          <Button
            disabled={isLoading}
            type='submit'
            className='flex w-full items-center'
          >
            {isLoading ? <Spinner className='[--color:#fff]' /> : 'Sign in'}
          </Button>
          {error && <p className='text-center text-sm text-red-500'>{error}</p>}
        </form>
        <p
          className={cn(
            'mt-4 text-center text-sm/6 text-gray-400',
            error && 'mt-2'
          )}
        >
          Don't have an account yet?{' '}
          <button
            onClick={onSignUp}
            className='font-semibold text-primary-600 hover:text-primary-500'
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}
