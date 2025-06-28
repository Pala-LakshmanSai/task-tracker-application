'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AuthPage() {
  const router = useRouter()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const payload =
      mode === 'signup' ? { name, email, password } : { email, password }

    const res = await fetch(`/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      return
    }

    if (mode === 'signup') {
      // Auto-login after signup
      const loginRes = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!loginRes.ok) {
        setError('Signup succeeded, but login failed')
        return
      }
    }

    // Use full page reload to ensure cookie is present for middleware
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">
          {mode === 'login' ? 'Login to TaskPilot' : 'Create Your Account'}
        </h1>

        {mode === 'signup' && (
          <Input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2"
            suppressHydrationWarning
          />
        )}

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2"
          suppressHydrationWarning
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <Button
          className="mt-4 w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
        </Button>

        <p className="mt-4 text-sm text-center">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                className="text-blue-500 underline"
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                className="text-blue-500 underline"
                onClick={() => setMode('login')}
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
