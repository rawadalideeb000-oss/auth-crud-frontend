import { Navigate, useLocation } from 'react-router'
import { useLogout } from '../features/auth/useLogout'
import type { User } from '../features/auth/auth.types'

export default function AccountPage() {
  const location = useLocation()
  const { logout } = useLogout()
  const user = location.state?.user as User | undefined

  if (!user || !sessionStorage.getItem('auth-crud.token')) {
    return <Navigate to="/login" replace />
  }

  return (
    <main
      className={`
        flex min-h-svh items-center justify-center
        bg-stone-50 px-5 py-12 text-stone-900
      `}
    >
      <section
        aria-labelledby="account-title"
        className={`
          w-full max-w-sm rounded-2xl border border-stone-200
          bg-white p-7 shadow-sm sm:p-9
        `}
      >
        <h1
          id="account-title"
          className="text-2xl font-semibold tracking-tight"
        >
          Your account
        </h1>
        <p className="mt-2 text-sm text-stone-500">You’re logged in.</p>

        <dl className="mt-7 space-y-5">
          <div>
            <dt className="text-sm text-stone-500">Name</dt>
            <dd className="mt-1 wrap-anywhere font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Email</dt>
            <dd className="mt-1 wrap-anywhere font-medium">{user.email}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={logout}
          className={`
            mt-7 min-h-11 w-full rounded-lg border border-stone-300
            text-sm font-medium hover:bg-stone-50
            focus-visible:outline-2 focus-visible:outline-offset-4
            focus-visible:outline-emerald-700
          `}
        >
          Log out
        </button>
      </section>
    </main>
  )
}
