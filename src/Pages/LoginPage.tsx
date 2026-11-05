import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLogin } from '../features/auth/useLogin'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const {
    user,
    isLoading,
    isRestoring,
    error,
    restoreError,
    login,
    logout,
    retryRestore,
  } = useLogin()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    await login(
      String(values.get('email') ?? ''),
      String(values.get('password') ?? ''),
    )
  }

  return (
    <main
      className={`
        flex min-h-svh items-center justify-center
        bg-stone-50 px-5 py-12 text-stone-900
      `}
    >
      <section
        aria-labelledby="login-title"
        className={`
          w-full max-w-sm rounded-2xl border border-stone-200
          bg-white p-7 shadow-sm sm:p-9
        `}
      >
        <div
          aria-hidden="true"
          className={`
            mb-7 grid h-10 w-10 place-items-center rounded-xl
            bg-emerald-50 text-xl text-emerald-800
          `}
        >
          ↗
        </div>
        <h1 id="login-title" className="text-2xl font-semibold tracking-tight">
          {user ? 'You’re logged in' : 'Welcome back'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          {user
            ? `Welcome, ${user.name}.`
            : 'Enter your details to log in to your account.'}
        </p>

        {isRestoring ? (
          <p role="status" className="mt-7 text-sm text-stone-500">
            Checking your session…
          </p>
        ) : restoreError ? (
          <div className="mt-7 space-y-4">
            <p role="alert" className="text-sm leading-6 text-red-700">
              {restoreError}
            </p>
            <button
              type="button"
              onClick={retryRestore}
              className={`
                min-h-11 rounded-lg border border-stone-300
                px-4 text-sm font-medium hover:bg-stone-50
                focus-visible:outline-2 focus-visible:outline-offset-4
                focus-visible:outline-emerald-700
              `}
            >
              Try again
            </button>
          </div>
        ) : user ? (
          <div className="mt-7 space-y-5">
            <p role="status" className="text-sm text-emerald-800">
              Successfully signed in as{' '}
              <span className="wrap-anywhere font-medium">{user.email}</span>.
            </p>
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={logout}
              disabled={isLoading}
              className={`
                min-h-11 w-full rounded-lg border border-stone-300
                text-sm font-medium hover:bg-stone-50
                focus-visible:outline-2 focus-visible:outline-offset-4
                focus-visible:outline-emerald-700
                disabled:cursor-wait disabled:opacity-60
              `}
            >
              {isLoading ? 'Logging out…' : 'Log out'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} aria-busy={isLoading} className="mt-7">
            <div role="alert" className={error ? 'mb-5' : 'sr-only'}>
              {error && (
                <p
                  className={`
                    rounded-lg bg-red-50 px-3 py-2.5
                    text-sm leading-6 text-red-700
                  `}
                >
                  {error}
                </p>
              )}
            </div>
            <fieldset disabled={isLoading} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  maxLength={254}
                  required
                  placeholder="you@example.com"
                  className={`
                    min-h-11 w-full rounded-lg border border-stone-300
                    px-3 py-2.5 text-base outline-none
                    placeholder:text-stone-400 focus:border-emerald-700
                    focus:ring-2 focus:ring-emerald-700/15
                  `}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    maxLength={128}
                    required
                    placeholder="Enter your password"
                    className={`
                      min-h-11 w-full rounded-lg border border-stone-300
                      px-3 py-2.5 pr-18 text-base outline-none
                      placeholder:text-stone-400 focus:border-emerald-700
                      focus:ring-2 focus:ring-emerald-700/15
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-pressed={showPassword}
                    aria-controls="password"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className={`
                      absolute inset-y-1 right-1 min-w-15 rounded-md px-2
                      text-xs font-medium text-stone-600 hover:bg-stone-100
                      focus-visible:outline-2 focus-visible:outline-emerald-700
                    `}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className={`
                  min-h-11 w-full rounded-lg bg-emerald-800 px-4 py-3
                  text-sm font-semibold text-white hover:bg-emerald-900
                  focus-visible:outline-2 focus-visible:outline-offset-4
                  focus-visible:outline-emerald-700
                  disabled:cursor-wait disabled:opacity-60
                `}
              >
                {isLoading ? 'Logging in…' : 'Log in'}
              </button>
            </fieldset>
          </form>
        )}
      </section>
    </main>
  )
}
