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
          action='/api/_auth/sign-in'
          className='space-y-4'
          onSubmit={handleSubmit}
        >
          <div>
            <Label htmlFor='name'>Name</Label>
            <Input
              min={2}
              required
              id='name'
              name='name'
              type='text'
              className='mt-2'
              placeholder='John Doe'
            />
          </div>
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
            {isLoading ? <Spinner className='[--color:#fff]' /> : 'Sign Up'}
          </Button>
          {error && <p className='text-center text-sm text-red-500'>{error}</p>}
        </form>
        <p
          className={cn(
            'mt-4 text-center text-sm/6 text-gray-400',
            error && 'mt-2'
          )}
        >
          Already have an account?{' '}
          <button
            onClick={onSignIn}
            className='font-semibold text-primary-600 hover:text-primary-500'
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
