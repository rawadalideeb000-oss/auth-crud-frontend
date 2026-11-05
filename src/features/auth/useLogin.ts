import { useEffect, useRef, useState } from 'react'

import { authApi, AuthError } from './auth.api'

import type { User } from './auth.api'

const TOKEN_KEY = 'auth-crud.token'

export function useLogin() {
  const [user, setUser] = useState<User | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const [isRestoring, setIsRestoring] = useState(true)

  const [error, setError] = useState('')

  const [restoreError, setRestoreError] = useState('')

  const [attempt, setAttempt] = useState(0)

  const pending = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    const signal = AbortSignal.any([
      controller.signal,
      AbortSignal.timeout(15000),
    ])

    async function restoreSession() {
      try {
        const token = sessionStorage.getItem(TOKEN_KEY)

        if (!token) return

        const result = await authApi.me(token, signal)

        if (!controller.signal.aborted) setUser(result.user)
      } catch (failure) {
        if (controller.signal.aborted) return

        if (failure instanceof AuthError && failure.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY)
        } else {
          setRestoreError('Could not check your saved login. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) setIsRestoring(false)
      }
    }

    void restoreSession()

    return () => controller.abort()
  }, [attempt])

  function retryRestore() {
    setRestoreError('')
    setIsRestoring(true)

    setAttempt((value) => value + 1)
  }

  async function login(email: string, password: string) {
    if (pending.current) return

    pending.current = true

    setIsLoading(true)

    setError('')

    try {
      const result = await authApi.login(email.trim().toLowerCase(), password)

      sessionStorage.setItem(TOKEN_KEY, result.token)

      setUser(result.user)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Unable to log in.')
    } finally {
      pending.current = false
      setIsLoading(false)
    }
  }

  async function logout() {
    if (pending.current) return

    pending.current = true

    setIsLoading(true)

    setError('')

    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      if (token) {
        try {
          await authApi.logout(token)
        } catch (failure) {
          if (!(failure instanceof AuthError && failure.status === 401)) {
            throw failure
          }
        }
      }

      sessionStorage.removeItem(TOKEN_KEY)
      setUser(null)
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : 'Unable to log out.',
      )
    } finally {
      pending.current = false
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    isRestoring,
    error,
    restoreError,
    login,
    logout,
    retryRestore,
  }
}
